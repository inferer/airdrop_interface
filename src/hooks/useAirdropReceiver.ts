import router, { useRouter } from 'next/router'
import { BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useCallback, useMemo, useState } from 'react'
import { useActiveWeb3React } from './index'
import { useAirdropManagerContract, useAirdropReceiverContract, useContractDemoContract } from './useContract'
import { useCurrency } from './Tokens'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useApproveCallback } from './useApproveCallback'
import { AirdropAssetTreasury_NETWORKS } from '../constants/airdropAssetTreasury'
import { fetcher, poster } from '../utils/axios'
import { getAlgTokenByLabel, getLabelTokenByAddress, getUSDTTokenByAddress } from '../utils/getTokenList'
import { useAirdropManager } from './useAirdropManager'
import { useShowToast } from '../state/application/hooks'
import { othersContracts } from '../constants/contractsLocal'
import { transformTime } from '../utils'


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
  const { handleShow } = useShowToast()
  
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
        handleShow({ type: 'error', content: `Fail to confirm.`, title: 'Error' })
        setConfirmStatus(2)
        return
      }
      try {
        const tx = await airdropReceiver.confirmTaskMulti(airdropId, algToken?.address, airToken, String(accountScore * 100), proof, { gasPrice: '1000000000', gasLimit: gasLimit })
        const receipt = await tx.wait()
        if (receipt.status) {
          router.push('/user/ongoing')
        }
      } catch (error) {
        console.log(error)
        handleShow({ type: 'error', content: `Fail to confirm.`, title: 'Error' })
      }
      
      setConfirmStatus(2)
      // const airdropAssetTreasury = await airdropReceiver.airdropAssetTreasury()
      // const airdropManager = await airdropReceiver.airdropManager()
      // await airdropReceiver.setAirdropManager('0xeA7e608Dc26040751191Bd7F55FD33DA92BaAB82')
      // await airdropReceiver.setAirdropAssetTreasury('0x59E56cDc025083c8D2cd6E01FAD0c56174c735E9')
      // console.log(airdropAssetTreasury, airdropManager)
    }
  }, [airdropReceiver, account, getAccountScoreProof, handleGetAirdropOne2])
  
  const handleRegisterTask = useCallback(async (
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
      
      // const res = await airdropReceiver.getAirdropBaseInfoByHash(othersContracts.projectContract + '.comment')
      // console.log(res)

      const proof = await getAccountScoreProof(account, label)

      let gasLimit = '5000000'
      try {
        console.log(airdropId, algToken?.address, airToken, String(accountScore * 100), proof)
        const gasEstimate = await airdropReceiver.estimateGas['registerTask'](airdropId, algToken?.address, airToken, String(accountScore * 100), proof)
        gasLimit = gasEstimate.toString()
      } catch (error: any) {
        console.log(error)
        const message = error.data?.data?.message || error.data?.message || error.message
        console.log(message)
        handleShow({ type: 'error', content: `Fail to Register.`, title: 'Error' })
        setConfirmStatus(2)
        return
      }
      try {
        const tx = await airdropReceiver.registerTask(airdropId, algToken?.address, airToken, String(accountScore * 100), proof, { gasPrice: '1000000000', gasLimit: gasLimit })
        const receipt = await tx.wait()
        if (receipt.status) {
          router.push('/contract-demo')
        }
      } catch (error) {
        console.log(error)
        handleShow({ type: 'error', content: `Fail to confirm.`, title: 'Error' })
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
        handleShow({ type: 'error', content: `Please select a task.`, title: 'Error' })
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
        handleShow({ type: 'error', content: `Please select a task.`, title: 'Error' })
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
    handleRegisterTask,
    completeStatus,
    handleUserCompleteTask,
    handleConfirmCompleteTask,
    algTokenCurrency,
    approvalState,
    approve
  }
}

export function useProjectContractDemo() {
  const [confirmStatus, setConfirmStatus] = useState(0)
  const { account } = useActiveWeb3React()
  const contractDemo: Contract | null = useContractDemoContract()
  const airdropManager = useAirdropManagerContract()
  const { handleShow } = useShowToast()
  const router = useRouter()

  const handleCommentAction = useCallback(async (inviteAddress: string, inviteNo: number, shareUrl: string) => {
    if (account && contractDemo) {
      setConfirmStatus(1)
      let gasLimit = '5000000'
      
      // const inviteAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8'.toLowerCase()
      // const inviteNo = 1
      // const shareUrl = 'https://twitter.com/intent/like?tweet_id=1720373913576952121'
      const taskId = router.query.taskId
      try {
        const gasEstimate = await contractDemo.estimateGas['share'](inviteAddress, inviteNo, shareUrl, taskId)
        gasLimit = gasEstimate.toString()
      } catch (error: any) {
        console.log(error)
        const message = error.data?.data?.message || error.data?.message || error.message
        console.log(message)
        // handleShow({ type: 'error', content: `Fail to Complete.`, title: 'Error' })
        setConfirmStatus(2)
        alert(message)
        return
      }
      try {
        const tx = await contractDemo.share(inviteAddress, inviteNo, shareUrl, taskId, { gasPrice: '1000000000', gasLimit: gasLimit })
        const receipt = await tx.wait()
        if (receipt.status) {
          // handleShow({ type: 'success', content: `Success.`, title: 'Success' })
          alert('Success')
        }
      } catch (error: any) {
        console.log(error)
        // handleShow({ type: 'error', content: `Fail to confirm.`, title: 'Error' })
        const message = error.data?.data?.message || error.data?.message || error.message
        console.log(message)
        alert(message)
      }
      setConfirmStatus(2)
    }
  }, [account, contractDemo])

  const [airdropInfo, setAirdropInfo] = useState<any>({})
  // getUserAirdropConfirmedByIndex
  const handleGetTaskInfo = useCallback(async (account: string) => {
    if (airdropManager) {
      const taskId = router.query.taskId
      const taskInfo = await airdropManager.getUserAirdropConfirmedByIndex(account, taskId)
      const airdrop = await airdropManager.getAirdrop(taskInfo.airdropId.toString())

      const offerTokenData = getUSDTTokenByAddress(airdrop[2][0])
      const labelTokenData = getLabelTokenByAddress(airdrop[2][2])
      const subDecimals = String((10 ** (offerTokenData?.decimals ?? 18))).length - (airdrop[3][0].toString()).length
      const _offerLocked = (Number(airdrop[3][0].toString()) / (10 ** (offerTokenData?.decimals ?? 18))).toFixed(subDecimals < 0 ?  0 : subDecimals)
      const expireOnTimestamp = Number(airdrop[5].toString()) * 1000 + Number(airdrop[4].toString()) * 1000
      const _labelLocked = (Number(airdrop[3][2]) / (10 ** (labelTokenData?.decimals ?? 18))).toFixed(4)
      const _claimed = (Number(airdrop[6].toString()) / (10 ** (labelTokenData?.decimals ?? 18))).toFixed(4)

      const _otherContent = airdrop[1][5] ? airdrop[1][5].split('|') : []
      const parameterType = _otherContent[1] ? JSON.parse(_otherContent[1] ?? '""') : []
      const parameterValue = airdrop[1][6] ? airdrop[1][6].split('|') : []
      const parameterInfo = parameterType.map((item: any, index: number) => ({...item, value: parameterValue[index] }))
      const tempData: any = {
        airdropId: airdrop[0].toString(),
        name: airdrop[1][0],
        label: airdrop[1][1],
        channel: airdrop[1][2],
        action: airdrop[1][3],
        content: airdrop[1][4],
        chain: _otherContent[0],
        landingPage: _otherContent[2],
        parameterInfo: parameterInfo,
        offerToken: {
          ...offerTokenData,
        },
        offerAirToken: airdrop[2][1],
        labelToken: {
          ...labelTokenData
        },
        sender: airdrop[2][3],
        // offerLocked: BigNumber.from(airdrop[3][0]).div(BigNumber.from((10 ** (offerTokenData?.decimals ?? 18)).toString())).toString(),
        offerLocked: _offerLocked,
        offerLabelLocked: BigNumber.from(airdrop[3][1]).div(BigNumber.from((10 ** (labelTokenData?.decimals ?? 1)).toString())).toString(),
        labelLocked: _labelLocked,
        unit: BigNumber.from(airdrop[3][3]).toString(),
        duration: airdrop[4].toString(),
        startTimestamp: airdrop[5].toString(),
        expireOn: transformTime(expireOnTimestamp),
        claimed: _claimed,
        completed: expireOnTimestamp < Date.now() || (Number(_labelLocked) - Number(_claimed) < 1),
        taskCompleted: taskInfo.completed
      }
      setAirdropInfo(tempData)
    }

  }, [airdropManager])

  const handleTestGas = useCallback( async () => {
    if (contractDemo && account) {
      try {
        const gasEstimate = await contractDemo.estimateGas['comment']()
        console.log(gasEstimate)
      } catch (error: any) {
        console.log(error)
        const message = error.data?.data?.message || error.data?.message || error.message
        console.log(message)
        // handleShow({ type: 'error', content: `Fail to Complete.`, title: 'Error' })
        
        return
      }
    }
  }, [contractDemo, account])

  return {
    handleCommentAction,
    confirmStatus,
    handleGetTaskInfo,
    airdropInfo,
    handleTestGas
  }
}
