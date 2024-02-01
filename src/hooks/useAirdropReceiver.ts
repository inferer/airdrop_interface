import router from 'next/router'
import { BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useCallback, useMemo, useState } from 'react'
import { useActiveWeb3React } from './index'
import { useAirdropReceiverContract } from './useContract'
import { useCurrency } from './Tokens'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useApproveCallback } from './useApproveCallback'
import { AirdropAssetTreasury_NETWORKS } from '../constants/airdropAssetTreasury'
import { fetcher, poster } from '../utils/axios'
import { getAlgTokenByLabel } from '../utils/getTokenList'
import { useAirdropManager } from './useAirdropManager'


export const getAccountScoreProof = async (account: string, label: string) => {
  const res = await fetcher(`/api/airdrop/getScoreProof`, { account, label })
  if (res.code === 0 && res.data) {
    return res.data.hexProof || []
  }
  return []
}

export const confirmCompleteAirdrop = async (account: string, taskIds: string[]) => {
  const res = await poster(`/api/airdrop-manager/confirmCompleteTask`, { account, taskIds })
  return res
}


export function useAirdropReceiver(algToken?: string) {
  const { handleGetAirdropOne2, handleUpdateUserAirdropConfirmedByTaskId } = useAirdropManager()
  const { account, chainId, library } = useActiveWeb3React()
  const airdropReceiver: Contract | null = useAirdropReceiverContract()

  const algTokenCurrency = useCurrency(algToken)
  const algTokenCurrencyAmount = useCurrencyBalance(account ?? undefined, algTokenCurrency ?? undefined)
  const [approvalState, approve] = useApproveCallback(algTokenCurrencyAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])

  const [confirmStatus, setConfirmStatus] = useState(0)
  const [completeStatus, setCompleteStatus] = useState(0)
  const [completeErrorMessage, setCompleteErrorMessage] = useState('')

  const handleConfirmTask = useCallback(async (
    airdropId: string,
    airToken: string,
    label: string,
    accountScore: number
  ) => {
    if (airdropReceiver && account) {
      setConfirmStatus(1)
      const algToken = getAlgTokenByLabel(label)
      // const airdropInfo = await handleGetAirdropOne2(Number(airdropId))
      // console.log(airdropInfo)

      const proof = await getAccountScoreProof(account, label)

      let gasLimit = '5000000'
      try {
        console.log(airdropId, algToken?.address, airToken, String(accountScore * 100), proof)
        const gasEstimate = await airdropReceiver.estimateGas['confirmTaskMulti'](airdropId, algToken?.address, airToken, String(accountScore * 100), proof)
        gasLimit = gasEstimate.toString()
      } catch (error: any) {
        console.log(error)
        const message = error.data?.data?.message || error.data?.message || error.message
        console.log(message)
        alert(message)
        setConfirmStatus(2)
        return
      }
      try {
        const tx = await airdropReceiver.confirmTaskMulti(airdropId, algToken?.address, airToken, String(accountScore * 100), proof, { gasPrice: '1000000000', gasLimit: gasLimit })
        const receipt = await tx.wait()
        if (receipt.status) {
          router.push('/user/ongoing')
          alert('Success')
        }
      } catch (error) {
        console.log(error)
      }
      
      setConfirmStatus(2)
      // const airdropAssetTreasury = await airdropReceiver.airdropAssetTreasury()
      // const airdropManager = await airdropReceiver.airdropManager()
      // await airdropReceiver.setAirdropManager('0xeA7e608Dc26040751191Bd7F55FD33DA92BaAB82')
      // await airdropReceiver.setAirdropAssetTreasury('0x59E56cDc025083c8D2cd6E01FAD0c56174c735E9')
      // console.log(airdropAssetTreasury, airdropManager)
    }
  }, [airdropReceiver, account, getAccountScoreProof, handleGetAirdropOne2])

  const handleUserCompleteTask = useCallback(async (
    taskIds: string[],
  ) => {
    if (account) {
      if (taskIds.length <= 0) {
        alert('no checked')
        return
      }
      setCompleteStatus(1)
      try {
        
        const res = await confirmCompleteAirdrop(account, taskIds)
        if (res.code === 0) {
          setTimeout(() => {
            handleUpdateUserAirdropConfirmedByTaskId(taskIds)
          }, 2000)
          
          setCompleteStatus(2)
        } else {
          setCompleteStatus(-1)
          // alert(res.message)
          setCompleteErrorMessage(res.message)
        }
        
        // setTimeout(() => {
        //   setCompleteStatus(0)
        // }, 5000)
        
        
      } catch(error: any) {
        console.log(error)
        setCompleteErrorMessage(error.toString())
        setCompleteStatus(-1)
      }
      
    }
  }, [ account, handleUpdateUserAirdropConfirmedByTaskId])
  const handleConfirmCompleteTask = useCallback(async (
    userAddress: string,
    taskIds: string[],
  ) => {
    if (airdropReceiver && account) {
      if (taskIds.length <= 0) {
        alert('no checked')
        return
      }
      setCompleteStatus(1)
      let gasLimit = '5000000'
      // await airdropReceiver.setAirdropAssetTreasury('0x92B97ea7dE7BEc9C6F75F9a450979F33098fB32a')
      try {
        console.log(taskIds)
        const gasEstimate = await airdropReceiver.estimateGas['completeTaskMulti'](userAddress, taskIds)
        gasLimit = gasEstimate.toString()
      } catch (error) {
        console.log(error)
      }
      console.log('gasLimit: ', gasLimit)
      try {
        const tx = await airdropReceiver.completeTaskMulti(userAddress, taskIds, { gasPrice: '1000000000', gasLimit: gasLimit })
        console.log(tx)
        const receipt = await tx.wait()
        if (receipt.status) {
          // handleGetUserAirdropConfirmed()
          alert('Success')
        }
        setCompleteStatus(2)

      } catch (error) {
        setCompleteStatus(-1)
        console.log(error)
      }
      
    }
  }, [airdropReceiver, account])
  return {
    confirmStatus,
    setCompleteStatus,
    completeErrorMessage,
    handleConfirmTask,
    completeStatus,
    handleUserCompleteTask,
    handleConfirmCompleteTask,
    algTokenCurrency,
    approvalState,
    approve
  }
}
