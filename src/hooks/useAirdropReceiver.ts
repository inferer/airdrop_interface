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
import { fetcher } from '../utils/axios'
import { getAlgTokenByLabel } from '../utils/getTokenList'


export const getAccountScoreProof = async (account: string, label: string) => {
  const res = await fetcher(`/api/airdrop/getScoreProof`, { account, label })
  if (res.code === 0 && res.data) {
    return res.data.hexProof || []
  }
  return []
}


export function useAirdropReceiver(algToken?: string) {
  const { account, chainId, library } = useActiveWeb3React()
  const airdropReceiver: Contract | null = useAirdropReceiverContract()

  const algTokenCurrency = useCurrency(algToken)
  const algTokenCurrencyAmount = useCurrencyBalance(account ?? undefined, algTokenCurrency ?? undefined)
  const [approvalState, approve] = useApproveCallback(algTokenCurrencyAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])

  const [confirmStatus, setConfirmStatus] = useState(0)

  const handleConfirmTask = useCallback(async (
    airdropId: string,
    airToken: string,
    label: string,
    accountScore: number
  ) => {
    if (airdropReceiver && account) {
      setConfirmStatus(1)
      const algToken = getAlgTokenByLabel(label)
      // const proof = await getAccountScoreProof(account, label)
      const proof = [
        "0x24bd877d334fede48689d7b38a115d54e4be67e1e250524fafd6c4f5c2982678",
        "0x7d62a42651b2229a3de4deca7a4b13c2693ba441604a647cfe583e9dd82adc66",
        "0xa4f566fea4ebff286bf999b9d07982f068fda581eb74af252a7d1eeb10efe5f2",
        "0x4abf69ba7a6a8c463e3612ffc8352d65802c1776cf83258f6560690d04fd2e31",
        "0x5a12d0670bec090a254d30886a042a818668f0ed1631030759793583ee8760a6",
        "0xf729712677269089179ce3556212dace3c6489148d3b42bda3e2eab40af97fd9",
        "0x76ccb5ed2f14cac26083d257374eb0a1c365914582447f9b1b9a5c68ffb4be3b",
        "0x402c9e48c05a1e7112db0de820da8386ec789d08715dfc1dd792bbc9d83a92a1"
    ]
      console.log(proof)
      let gasLimit = '5000000'
      try {
        console.log(airdropId, algToken?.address, airToken, String(accountScore * 100), proof)
        const gasEstimate = await airdropReceiver.estimateGas['confirmTask'](airdropId, algToken?.address, airToken, String(accountScore * 100), proof)
        gasLimit = gasEstimate.toString()
      } catch (error) {
        console.log(error)
      }
      // const tx = await airdropReceiver.confirmTask(airdropId, algToken?.address, airToken, String(accountScore * 100), proof, { gasPrice: '1000000000', gasLimit: gasLimit })
      // const receipt = tx.wait()
      // if (receipt.status) {
      //   alert('Success')
      // }
      setConfirmStatus(2)
      // const airdropAssetTreasury = await airdropReceiver.airdropAssetTreasury()
      // const airdropManager = await airdropReceiver.airdropManager()
      // await airdropReceiver.setAirdropManager('0xeA7e608Dc26040751191Bd7F55FD33DA92BaAB82')
      // await airdropReceiver.setAirdropAssetTreasury('0x59E56cDc025083c8D2cd6E01FAD0c56174c735E9')
      // console.log(airdropAssetTreasury, airdropManager)
    }
  }, [airdropReceiver, account, getAccountScoreProof])

  const handleCompleteTask = useCallback(async (
    airdropIds: string[],
  ) => {
    if (airdropReceiver && account) {
      if (airdropIds.length <= 0) {
        alert('no checked')
        return
      }
      let gasLimit = '5000000'
      // await airdropReceiver.setAirdropAssetTreasury('0x92B97ea7dE7BEc9C6F75F9a450979F33098fB32a')
      try {
        console.log(airdropIds)
        const gasEstimate = await airdropReceiver.estimateGas['completeTask'](account, airdropIds)
        gasLimit = gasEstimate.toString()
      } catch (error) {
        console.log(error)
      }
      const tx = await airdropReceiver.completeTask(account, airdropIds, { gasPrice: '1000000000', gasLimit: gasLimit })
      const receipt = tx.wait()
      if (receipt.status) {
        alert('Success')
      }
    }
  }, [airdropReceiver, account])
  return {
    confirmStatus,
    handleConfirmTask,
    handleCompleteTask,
    algTokenCurrency,
    approvalState,
    approve
  }
}
