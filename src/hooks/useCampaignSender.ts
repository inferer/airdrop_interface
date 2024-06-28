import router from 'next/router'
import { BigNumber, ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { Currency, ETHER, Token, Trade } from '@uniswap/sdk'
import { useCallback, useMemo, useState } from 'react'
import { DEFAULT_DEADLINE_FROM_NOW, INFERER_AIRDROP_SOURCE, INITIAL_ALLOWED_SLIPPAGE } from '../constants'
import { useActiveWeb3React } from './index'
import { useAirdropSenderContract, useCampaignSenderContract } from './useContract'
import { useDerivedSwapInfo, useSwapState } from '../state/swap/hooks'
import { useCurrency } from './Tokens'
import { getUSDTTokenFromAirToken } from '../utils/getTokenList'
import { useApproveCallback } from './useApproveCallback'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { AirdropAssetTreasury_NETWORKS } from '../constants/airdropAssetTreasury'
import { useSwapCallArguments } from './useSwapCallback'
import { useAddPopup, useShowToast } from '../state/application/hooks'
import { useAirTokenPercent, useAirTokenPercentBalance, useCreateContractABI, useCreateContractABIAll } from '../state/airdrop/hooks'
import { Field } from '../state/swap/actions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../state'
import { IABIItem, updateCreateContractABI } from '../state/airdrop/actions'
import { formatInput, getContract } from '../utils'
import BN from 'bignumber.js'


export function useCreateCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
) {
  const { account, chainId, library } = useActiveWeb3React()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()
  const { independentField, typedValue, recipient } = useSwapState()
  const airPercent = useAirTokenPercent()

  const swapCalls = useSwapCallArguments(v2Trade, allowedSlippage, deadline, recipientAddressOrName)
  let lockedToken
  let lockedTokenAir
  let lockedLabel
  let args: any = []
  if (swapCalls[0]) {
    args = swapCalls[0]?.parameters?.args
    lockedTokenAir = args[2][0]
    lockedLabel = args[2][1]
    
  }
    // @ts-ignore
  lockedToken = getUSDTTokenFromAirToken(currencies[Field.INPUT] && currencies[Field.INPUT].address, chainId)
  const lockedCurrency = useCurrency(lockedToken)

  const lockedCurrencyAmount = useCurrencyBalance(account ?? undefined, lockedCurrency ?? undefined)
  const lockedAmount = useMemo(() => {
    if (args[0] && lockedCurrency) {
      if (independentField === Field.INPUT) {
        const div1 = BigNumber.from(parseInt(args[0], 16).toString()).toString()
        const div2 = BigNumber.from((10 ** lockedCurrency?.decimals).toString(10)).toString()
        return (Number(div1) / Number(div2)).toString()
      } else {
        const div1 = BigNumber.from(parseInt(args[1], 16).toString()).toString()
        const div2 = BigNumber.from((10 ** lockedCurrency?.decimals).toString(10)).toString()
        return (Number(div1) / Number(div2)).toString()
      }
      
    }
    return '0'
  }, [args, lockedCurrency, independentField])
  const lockedLabelCurrency = useCurrency(lockedLabel)
  const lockedLabelCurrencyAmount = useCurrencyBalance(account ?? undefined, lockedLabelCurrency ?? undefined)
  const percentBalance = useAirTokenPercentBalance(lockedLabelCurrencyAmount)
  const lockedAmountAB = useMemo(() => {
    let lockedAmountA = ''
    let lockedAmountAShow = ''
    let lockedAmountB = ''
    let lockedAmountBShow = ''
    if (args[0] && lockedCurrency && v2Trade) {
      const _lockedAmountB = percentBalance.balance2
      // const _lockedAmountA = BigNumber.from(parseInt(args[0], 16).toString())
      const _lockedAmountA = independentField === Field.INPUT ? BigNumber.from(args[0]) : BigNumber.from(args[1])
      lockedAmountB = BigNumber.from((_lockedAmountB * (10 ** v2Trade.outputAmount.currency.decimals)).toString()).toHexString()
      lockedAmountA = _lockedAmountA.toHexString()
      lockedAmountAShow = (Number(_lockedAmountA.toString()) / (10 ** lockedCurrency?.decimals)).toString()
      lockedAmountBShow = percentBalance.balance2?.toString(10)

    }
    
    return {
      lockedAmountA,
      lockedAmountB,
      lockedAmountAShow,
      lockedAmountBShow
    }
  }, [args, lockedCurrency, airPercent, v2Trade, percentBalance, independentField])
  const [approvalState, approve] = useApproveCallback(lockedCurrencyAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])
  const [approvalStateAir, approveAir] = useApproveCallback(v2Trade?.inputAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])
  const [approvalStateLabel, approveLabel] = useApproveCallback(v2Trade?.outputAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])

  return {
    currencies,
    args,
    lockedAmount,
    lockedAmountAB,
    lockedCurrency,
    lockedCurrencyAir: currencies[Field.INPUT],
    lockedCurrencyAirCampaign: currencies[Field.OUTPUT],
    lockedCurrencyAmount,
    outputAmount: v2Trade?.outputAmount,
    approvalState,
    approve,
    approvalStateLabel,
    approveLabel,
    approvalStateAir,
    approveAir
  }
}

export function useCampaignSender(args: any[], lockedToken?: Token, ) {
  const { account, chainId, library } = useActiveWeb3React()
  const campaignSender: Contract | null = useCampaignSenderContract()
  const [createStatus, setCreateStatus] = useState(0)
  const { independentField } = useSwapState()
  const { handleShow } = useShowToast()
  
  const handleCreateCampaign = useCallback(async (
    name: string,
    label: string,
    channel: string,
    action: string,
    landingPage: string,
    arwId: string,
    offerToken: Currency,
    airCampaign: Currency,
    offerAmount: string,
    applyDuration: number,
    voteDuration: number,
    awardList: any[]
  ) => {
    if (campaignSender && account && lockedToken) {
      setCreateStatus(1)

      const isETH = lockedToken === ETHER
      const baseInfo = [name, label, channel, action, landingPage, arwId, 'inferer']
      // @ts-ignore
      const offer_label_token = [isETH ? ethers.constants.AddressZero : offerToken.address, airCampaign.address]
      const _offerAmount = new BN(offerAmount).multipliedBy(10 ** offerToken.decimals).toString()
      const _nowTime = Math.floor(Date.now() / 1000)
      const offer_label_locked = [_offerAmount, applyDuration - _nowTime, voteDuration - _nowTime]
      console.log(applyDuration, voteDuration, _nowTime)
      console.log(baseInfo)
      console.log(offer_label_token)
      console.log(offer_label_locked)
      console.log(awardList)
      if (applyDuration <= _nowTime) {
        handleShow({ type: 'error', content: `Apply deadline should be later than now.`, title: 'Error' })
        setCreateStatus(0)
        return
      }
      if (voteDuration <= applyDuration) {
        handleShow({ type: 'error', content: `Vote deadline should be later than apply deadline.`, title: 'Error' })
        setCreateStatus(0)
        return
      }
      let gasLimit = '5000000'
      try {
        const gasEstimate = await campaignSender.estimateGas['createCampaign'](baseInfo, offer_label_token, offer_label_locked, awardList, 
          {value: isETH ? _offerAmount : '0'})
        gasLimit = gasEstimate.toString()
      } catch (error: any) {
        const message = error.data?.data?.message || error.data?.message || error.message
        if (message.indexOf('CampaignSender: Award not enough!') > -1){
          handleShow({ type: 'error', content: `Award not enough!`, title: 'Error' })
        } else {
          handleShow({ type: 'error', content: message, title: 'Error' })
        }       
        setCreateStatus(0)
        return
      }
      try {
        const tx = await campaignSender['createCampaign'](baseInfo, offer_label_token, offer_label_locked, awardList, { gasPrice: '1000000000', gasLimit: gasLimit, value: isETH ? _offerAmount : '0' })
        const receipt = await tx.wait()
        if (receipt.status) {
          localStorage.removeItem(INFERER_AIRDROP_SOURCE)
          router.push('/project/campaigns')
        }
      } catch(error) {
        console.log(error)
      }
      setCreateStatus(2)

      
      // const airdropManager = await campaignSender.airdropManager()
      // const airdropAssetTreasury = await campaignSender.airdropAssetTreasury()

      // await campaignSender.setAirdropManager('0xF127f051d9E06a4Af12e7EB2741319ded8D803db')
      // await campaignSender.setAirdropAssetTreasury('0x59E56cDc025083c8D2cd6E01FAD0c56174c735E9')
      // console.log(airdropManager, airdropAssetTreasury)
    }
  }, [campaignSender, account, args, lockedToken, independentField])

  return {
    createStatus,
    handleCreateCampaign,
  }
}
