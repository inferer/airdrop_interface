import router from 'next/router'
import { BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from './index'
import { useAirdropReceiverContract } from './useContract'
import { useCurrency } from './Tokens'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useApproveCallback } from './useApproveCallback'
import { AirdropAssetTreasury_NETWORKS } from '../constants/airdropAssetTreasury'


export function useAirdropReceiver(algToken?: string) {
  const { account, chainId, library } = useActiveWeb3React()
  const airdropReceiver: Contract | null = useAirdropReceiverContract()

  const algTokenCurrency = useCurrency(algToken)
  const algTokenCurrencyAmount = useCurrencyBalance(account ?? undefined, algTokenCurrency ?? undefined)
  const [approvalState, approve] = useApproveCallback(algTokenCurrencyAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])

  const handleConfirmTask = useCallback(async (
    airdropId: string,
    airToken: string
  ) => {
    if (airdropReceiver && account) {
      

      let gasLimit = '5000000'
      try {
        const gasEstimate = await airdropReceiver.estimateGas['confirmTask'](airdropId, algToken, airToken)
        gasLimit = gasEstimate.toString()
      } catch (error) {
        console.log(error)
      }
      const tx = await airdropReceiver.confirmTask(airdropId, algToken, airToken, { gasPrice: '1000000000', gasLimit: gasLimit })
      const receipt = tx.wait()
      if (receipt.status) {
        alert('Success')
      }

      // const airdropAssetTreasury = await airdropReceiver.airdropAssetTreasury()
      // const airdropManager = await airdropReceiver.airdropManager()
      // await airdropReceiver.setAirdropManager('0xeA7e608Dc26040751191Bd7F55FD33DA92BaAB82')
      // await airdropReceiver.setAirdropAssetTreasury('0x59E56cDc025083c8D2cd6E01FAD0c56174c735E9')
      // console.log(airdropAssetTreasury, airdropManager)
    }
  }, [airdropReceiver, account])

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
        const gasEstimate = await airdropReceiver.estimateGas['completeTask'](airdropIds)
        gasLimit = gasEstimate.toString()
      } catch (error) {
        console.log(error)
      }
      const tx = await airdropReceiver.completeTask(airdropIds, { gasPrice: '1000000000', gasLimit: gasLimit })
      const receipt = tx.wait()
      if (receipt.status) {
        alert('Success')
      }
    }
  }, [airdropReceiver, account])
  return {
    handleConfirmTask,
    handleCompleteTask,
    algTokenCurrency,
    approvalState,
    approve
  }
}
