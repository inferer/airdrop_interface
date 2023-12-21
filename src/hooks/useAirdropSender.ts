import router from 'next/router'
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
import { AirdropAssetTreasury_NETWORKS } from '../constants/airdropAssetTreasury'
import { useSwapCallArguments } from './useSwapCallback'
import { useAddPopup } from '../state/application/hooks'


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
  let lockedTokenAir
  let args: any = []
  if (swapCalls[0]) {
    args = swapCalls[0]?.parameters?.args
    lockedTokenAir = args[2][0]
    lockedToken = getUSDTTokenFromAirToken(lockedTokenAir)
  }
  const lockedCurrency = useCurrency(lockedToken)
  const lockedCurrencyAmount = useCurrencyBalance(account ?? undefined, lockedCurrency ?? undefined)
  const lockedAmount = useMemo(() => {
    if (args[0] && lockedCurrency) {
      return BigNumber.from(parseInt(args[0], 16)).div(10 ** lockedCurrency?.decimals).toString()
    }
    return '0'
  }, [args, lockedCurrency])

  const [approvalState, approve] = useApproveCallback(lockedCurrencyAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])
  const [approvalStateLabel, approveLabel] = useApproveCallback(v2Trade?.outputAmount,  chainId && AirdropAssetTreasury_NETWORKS[chainId])
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
    unint: string,
    content: string
  ) => {
    if (airdropSender && account && lockedToken) {
      console.log(lockedToken, args)
      const baseInfo = [name, label, channel, action, content]
      const route = args[2]
      const offer_label_token = [lockedToken.address, route[0], route[route.length - 1], account]
      const offer_label_locked = [args[0], '0', args[1], unint]
      const duration = 7 * 24 * 60 * 60

      console.log(baseInfo, offer_label_token, offer_label_locked, duration)
      let gasLimit = '5000000'

      try {
        const gasEstimate = await airdropSender.estimateGas['createAirdrop'](baseInfo, offer_label_token, offer_label_locked, duration)
        gasLimit = gasEstimate.toString()
      } catch (error) {

      }
      const tx = await airdropSender['createAirdrop'](baseInfo, offer_label_token, offer_label_locked, duration, { gasPrice: '1000000000', gasLimit: gasLimit })
      console.log(tx)
      const receipt = await tx.wait()
      console.log(receipt)
      if (receipt.status) {
        router.push('/collect')
      }
      // const airdropManager = await airdropSender.airdropManager()
      // const airdropAssetTreasury = await airdropSender.airdropAssetTreasury()

      // await airdropSender.setAirdropManager('0xF127f051d9E06a4Af12e7EB2741319ded8D803db')
      // await airdropSender.setAirdropAssetTreasury('0x59E56cDc025083c8D2cd6E01FAD0c56174c735E9')
      // console.log(airdropManager, airdropAssetTreasury)
    }
  }, [airdropSender, account, args, lockedToken])

  return {
    handleCreateAirdrop,
  }
}

