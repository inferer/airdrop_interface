import router from 'next/router'
import { BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useCallback, useMemo } from 'react'
import { useActiveWeb3React } from './index'
import { useAirdropReceiverContract } from './useContract'


export function useAirdropReceiver() {
  const { account, chainId, library } = useActiveWeb3React()
  const airdropReceiver: Contract | null = useAirdropReceiverContract()

  const handleConfirmTask = useCallback(async (
    airdropId: string,
    amount: string
  ) => {
    if (airdropReceiver && account) {
      
      const _amount = BigNumber.from(amount).mul(BigNumber.from(10).pow(18)).toString()

      let gasLimit = '5000000'
      try {
        const gasEstimate = await airdropReceiver.estimateGas['confirmTask'](airdropId, _amount)
        gasLimit = gasEstimate.toString()
      } catch (error) {
        console.log(error)
      }
      const tx = await airdropReceiver.confirmTask(airdropId, _amount, { gasPrice: '1000000000', gasLimit: gasLimit })
      const receipt = tx.wait()
      if (receipt.status) {
        alert('Success')
      }
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
    handleCompleteTask
  }
}
