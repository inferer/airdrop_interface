import { BigNumber } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { Currency, Token, Trade } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { DEFAULT_DEADLINE_FROM_NOW, INITIAL_ALLOWED_SLIPPAGE, ROUTER_ADDRESS } from '../constants'
import { useActiveWeb3React } from './index'
import { useAirdropSenderContract } from './useContract'
import { useDerivedSwapInfo } from '../state/swap/hooks'
import { useCurrency } from './Tokens'
import { getUSDTTokenFromAirToken } from '../utils/getTokenList'
import { useApproveCallback } from './useApproveCallback'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { AirdropSender_NETWORKS } from '../constants/airdropSender'
import { useSwapCallArguments } from './useSwapCallback'



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

  const swapCalls = useSwapCallArguments(v2Trade, allowedSlippage, deadline, recipientAddressOrName)
  let lockedToken
  let args: any = []
  if (swapCalls[0]) {
    args = swapCalls[0]?.parameters?.args
    // console.log(parseInt(args[0], 16))
    lockedToken = getUSDTTokenFromAirToken(args[2][0])
  }
  const lockedCurrency = useCurrency(lockedToken)
  const lockedCurrencyAmount = useCurrencyBalance(account ?? undefined, lockedCurrency ?? undefined)
  // const lockedAmount = lockedCurrencyAmount?.divide(BigInt(10 ** (lockedCurrency?.decimals ?? 18 ) )).toFixed(3)
  const lockedAmount = useMemo(() => {
    if (args[0] && lockedCurrency) {
      return BigNumber.from(parseInt(args[0], 16)).div(10 ** lockedCurrency?.decimals).toString()
    }
    return '0'
  }, [args, lockedCurrency])

  const [approvalState, approve] = useApproveCallback(lockedCurrencyAmount,  chainId && AirdropSender_NETWORKS[chainId])
  const [approvalStateLabel, approveLabel] = useApproveCallback(v2Trade?.outputAmount,  chainId && AirdropSender_NETWORKS[chainId])
  return {
    args,
    lockedAmount,
    lockedCurrency,
    lockedCurrencyAmount,
    outputAmount: v2Trade?.outputAmount,
    approvalState,
    approve,
    approvalStateLabel,
    approveLabel
  }
}

export function useCreateAirdrop(args: any[], lockedToken?: Token, ) {
  const { account, chainId, library } = useActiveWeb3React()
  const airdropSender: Contract | null = useAirdropSenderContract()


  const handleCreateAirdrop = useCallback(async (
    name: string,
    label: string,
    channel: string,
    action: string,
    content: string
  ) => {
    if (airdropSender && account && lockedToken) {
      console.log(lockedToken, args)
      const baseInfo = [name, label, channel, action, content]
      const route = args[2]
      const offer_label_token = [lockedToken.address, route[0], route[route.length - 1], account]
      const offer_label_locked = [args[0], args[1]]
      const duration = 24 * 60 * 60

      console.log(baseInfo, offer_label_token, offer_label_locked, duration)
      let gasLimit = '5000000'
      try {
        const gasEstimate = await airdropSender.estimateGas['createAirdrop'](baseInfo, offer_label_token, offer_label_locked, duration)
        gasLimit = gasEstimate.toString()
      } catch (error) {

      }
      const tx = await airdropSender['createAirdrop'](baseInfo, offer_label_token, offer_label_locked, duration, { gasPrice: '1000000000', gasLimit: gasLimit })
      const receipt = tx.wait()
      if (receipt.status) {
        
      }
      // await airdropSender.setRouter(ROUTER_ADDRESS)
      // const airdropManager = await airdropSender.airdropManager()
      // const router = await airdropSender.router()
      // console.log(airdropManager, router)
    }
  }, [airdropSender, account, args, lockedToken])

  return {
    handleCreateAirdrop,
  }
}


export function useConfirmTask() {
  const { account, chainId, library } = useActiveWeb3React()
  const airdropSender: Contract | null = useAirdropSenderContract()


  const handleConfirmTask = useCallback(async (
    airdropId: string,
    amount: string
  ) => {
    if (airdropSender && account) {
      
      const _amount = BigNumber.from(amount).mul(BigNumber.from(10).pow(18)).toString()

      let gasLimit = '5000000'
      try {
        const gasEstimate = await airdropSender.estimateGas['confirmTask'](airdropId, _amount)
        gasLimit = gasEstimate.toString()
      } catch (error) {

      }
      const tx = await airdropSender.confirmTask(airdropId, _amount, { gasPrice: '1000000000', gasLimit: gasLimit })
      const receipt = tx.wait()
      if (receipt.status) {
        alert('Success')
      }
    }
  }, [airdropSender, account])

  return {
    handleConfirmTask
  }
}
