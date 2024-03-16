import router from 'next/router'
import { BigNumber, ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { Currency, ETHER, Token, Trade } from '@uniswap/sdk'
import { useCallback, useMemo, useState } from 'react'
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE, ROUTER_ADDRESS } from '../constants'
import { useActiveWeb3React } from './index'
import { useAirdropSenderContract } from './useContract'
import { useDerivedSwapInfo, useSwapState } from '../state/swap/hooks'
import { useCurrency } from './Tokens'
import { getUSDTTokenFromAirToken } from '../utils/getTokenList'
import { useApproveCallback } from './useApproveCallback'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { AirdropAssetTreasury_NETWORKS } from '../constants/airdropAssetTreasury'
import { useSwapCallArguments } from './useSwapCallback'
import { useAddPopup } from '../state/application/hooks'
import { useAirTokenPercent, useAirTokenPercentBalance, useCreateContractABI, useCreateContractABIAll } from '../state/airdrop/hooks'
import { Field } from '../state/swap/actions'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../state'
import { IABIItem, updateCreateContractABI } from '../state/airdrop/actions'
import { formatInput, getContract } from '../utils'


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
    lockedToken = getUSDTTokenFromAirToken(lockedTokenAir)
  }
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
      const _lockedAmountA = BigNumber.from(parseInt(args[0], 16).toString())
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
  }, [args, lockedCurrency, airPercent, v2Trade, percentBalance])

  const [approvalState, approve] = useApproveCallback(lockedCurrencyAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])
  const [approvalStateAir, approveAir] = useApproveCallback(v2Trade?.inputAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])
  const [approvalStateLabel, approveLabel] = useApproveCallback(v2Trade?.outputAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])
  return {
    args,
    lockedAmount,
    lockedAmountAB,
    lockedCurrency,
    lockedCurrencyAir: currencies[Field.INPUT],
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

export function useCreateAirdrop(args: any[], lockedToken?: Token, ) {
  const { account, chainId, library } = useActiveWeb3React()
  const airdropSender: Contract | null = useAirdropSenderContract()
  const [createStatus, setCreateStatus] = useState(0)

  const handleCreateAirdrop = useCallback(async (
    name: string,
    label: string,
    _duration: string,
    channel: string,
    action: string,
    unint: string,
    content: string,
    lockedAmountA: string,
    lockedAmountB: string,
    chain: string,
    parameter: any[],
    ladningPage: string
  ) => {
    if (airdropSender && account && lockedToken) {
      setCreateStatus(1)
      console.log(content, lockedAmountA, lockedAmountB, chain, parameter, ladningPage)
      try {
        const params = parameter.map(item => {
          return formatInput(item.value, item.type)
        })
        console.log(params)
      } catch (err) {

      }
      const parameterType = JSON.stringify(parameter.map(item => ({name: item.name, type: item.type})))
      const parameterValue = parameter.map(item =>(item.type === 'address' ? item.value.toLowerCase() : item.value)).join('|')
      const _content = chain + '|' + parameterType + '|' + ladningPage
      const isETH = lockedToken === ETHER
      const baseInfo = [name, label, channel, action, content, _content, parameterValue, 'inferer']
      const route = args[2]
      console.log(lockedAmountA, lockedAmountB, args[1], unint)
      const offer_label_token = [isETH ? ethers.constants.AddressZero : lockedToken.address, route[0], route[route.length - 1], account]
      const offer_label_locked = [lockedAmountA, lockedAmountB, args[1], unint]
      const duration = parseInt(_duration) * 24 * 60 * 60
      console.log(baseInfo, offer_label_token, offer_label_locked, duration)
      let gasLimit = '5000000'
      

      try {
        const gasEstimate = await airdropSender.estimateGas['createAirdrop'](baseInfo, offer_label_token, offer_label_locked, duration, 
          {value: isETH ? lockedAmountA : '0'})
        gasLimit = gasEstimate.toString()
      } catch (error) {

      }
      try {
        const tx = await airdropSender['createAirdrop'](baseInfo, offer_label_token, offer_label_locked, duration, { gasPrice: '1000000000', gasLimit: gasLimit, value: isETH ? lockedAmountA : '0' })
        console.log(tx)
        const receipt = await tx.wait()
        console.log(receipt)
        if (receipt.status) {
          router.push('/project/ongoing')
        }
      } catch(error) {
        console.log(error)
      }
      setCreateStatus(2)

      
      // const airdropManager = await airdropSender.airdropManager()
      // const airdropAssetTreasury = await airdropSender.airdropAssetTreasury()

      // await airdropSender.setAirdropManager('0xF127f051d9E06a4Af12e7EB2741319ded8D803db')
      // await airdropSender.setAirdropAssetTreasury('0x59E56cDc025083c8D2cd6E01FAD0c56174c735E9')
      // console.log(airdropManager, airdropAssetTreasury)
    }
  }, [airdropSender, account, args, lockedToken])

  const contractABI = useCreateContractABIAll()
  const handleEstimateGas = useCallback(async (contractAddress: string, funName: string, parameter: any[]) => {
    let unit = 1
    if (library && account && contractABI.length > 0) {
      const contract = getContract(contractAddress, contractABI, library, account ? account : undefined)
      try {
        const parameterValue = parameter.map(pr => pr.value)
        const tempItem = contractABI.find(item => item.name === funName)
        const hasTaskId = tempItem?.inputs.find(item => item.name === '_taskId')
        if (hasTaskId) {
          parameterValue.push(0)
        }
        const gasEstimate = await contract.estimateGas[funName](...parameterValue)
        console.log(gasEstimate.toString())
        const gasLimit = Number(gasEstimate.toString())
        if (gasLimit > 10000) {
          unit = 2
        } 
        if (gasLimit > 100000) {
          unit = 3
        } 
      } catch (error) {
        console.log(error)
      }
    }

    return unit

  }, [contractABI, library])

  return {
    createStatus,
    handleCreateAirdrop,
    handleEstimateGas
  }
}

export function useCreateContractAirdrop() {
  const dispatch = useDispatch<AppDispatch>()

  const handleUpdateContractABI = useCallback((ABIList: IABIItem[]) => {
    dispatch(updateCreateContractABI({ ABIList }))
  }, [dispatch])

  return {
    handleUpdateContractABI
  }

}
