import { Contract } from '@ethersproject/contracts'
import { useCallback, useMemo, useState } from 'react'
import { useActiveWeb3React } from './index'
import { useCampaignApplyContract } from './useContract'
import { useCurrency } from './Tokens'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useApproveCallback } from './useApproveCallback'
import { AirdropAssetTreasury_NETWORKS } from '../constants/airdropAssetTreasury'
import { useAirdropManager } from './useAirdropManager'
import { useShowToast } from '../state/application/hooks'
import { othersContracts } from '../constants/contractsLocal'

export function useCampaignApply(algToken?: string) {
  const { account, chainId, library } = useActiveWeb3React()
  const campaignApply: Contract | null = useCampaignApplyContract()

  const algTokenCurrency = useCurrency(algToken)
  const algTokenCurrencyAmount = useCurrencyBalance(account ?? undefined, algTokenCurrency ?? undefined)
  const [approvalState, approve] = useApproveCallback(algTokenCurrencyAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])

  const [applyStatus, setApplyStatus] = useState(0)
  const [completeStatus, setCompleteStatus] = useState(0)
  const [completeErrorMessage, setCompleteErrorMessage] = useState('')
  const { handleShow } = useShowToast()


  const handleCampaignApply = useCallback(async (
    campaignId: string,
    arwId: string
  ) => {
    if (campaignApply && account) {
      
      setApplyStatus(1)
      let gasLimit = '5000000'
      try {
        const gasEstimate = await campaignApply.estimateGas['applyCampaign'](campaignId, arwId)
        gasLimit = gasEstimate.toString()
      } catch (error: any) {
        console.log(error)
        const message = error.data?.data?.message || error.data?.message || error.message
        console.log(message)
        handleShow({ type: 'error', content: `Fail to apply.`, title: 'Error' })
        setApplyStatus(2)
        return
      }
      console.log('gasLimit: ', gasLimit)
      try {
        const tx = await campaignApply.applyCampaign(campaignId, arwId, { gasPrice: '1000000000', gasLimit: gasLimit })
        console.log(tx)
        const receipt = await tx.wait()
        if (receipt.status) {
          // handleGetUserAirdropConfirmed()
          alert('Success')
        }

      } catch (error) {
        console.log(error)
        handleShow({ type: 'error', content: `Fail to apply.`, title: 'Error' })
      }
      setApplyStatus(2)
    }
  }, [campaignApply, account])

  const handleCampaignVote = useCallback(async (
    campaignId: string,
    index: number
  ) => {
    if (campaignApply && account) {
      
      setApplyStatus(1)
      let gasLimit = '5000000'
      try {
        const gasEstimate = await campaignApply.estimateGas['voteCampaign'](campaignId, index)
        gasLimit = gasEstimate.toString()
      } catch (error: any) {
        console.log(error)
        const message = error.data?.data?.message || error.data?.message || error.message
        console.log(message)
        handleShow({ type: 'error', content: `Fail to vote.`, title: 'Error' })
        setApplyStatus(2)
        return
      }
      console.log('gasLimit: ', gasLimit)
      try {
        const tx = await campaignApply.voteCampaign(campaignId, index, { gasPrice: '1000000000', gasLimit: gasLimit })
        console.log(tx)
        const receipt = await tx.wait()
        if (receipt.status) {
          // handleGetUserAirdropConfirmed()
          alert('Success')
        }

      } catch (error) {
        console.log(error)
        handleShow({ type: 'error', content: `Fail to vote.`, title: 'Error' })
      }
      setApplyStatus(2)
    }
  }, [campaignApply, account])
  return {
    applyStatus,
    setCompleteStatus,
    completeErrorMessage,
    completeStatus,
    handleCampaignApply,
    handleCampaignVote,
    algTokenCurrency,
    approvalState,
    approve
  }
}

