import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Trade, TokenAmount, CurrencyAmount, ETHER } from '@uniswap/sdk'
import { useCallback, useMemo, useState } from 'react'
import { useTokenAllowance } from '../data/Allowances'
import { getTradeVersion, useV1TradeExchangeAddress } from '../data/V1'
import { Field } from '../state/swap/actions'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/prices'
import { calculateGasMargin, getRouterAddress } from '../utils'
import { useTokenContract } from './useContract'
import { useActiveWeb3React } from './index'
import { Version } from './useToggledVersion'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const [currentPending, setCurrentPending] = useState(0)
  const { account } = useActiveWeb3React()
  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {

    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN
    if (currentPending === 1) return ApprovalState.PENDING
    if (currentPending === 2) return ApprovalState.APPROVED
    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender, currentPending])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()


  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!tokenContract) {
      console.error('tokenContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }
    setCurrentPending(1)
    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString())
    })
    return new Promise(async (resolve) => {
      try {
        
        const tx = await tokenContract.approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
          gasLimit: calculateGasMargin(estimatedGas)
        })
        const receipt = await tx.wait()
        setCurrentPending(2)
        resolve()
        // setTimeout(() => {
        //   setCurrentPending(0)
        // }, 2000)
  
      } catch(error) {
        setCurrentPending(0)
        console.debug('Failed to approve token', error)
      }
    })
    
    // return tokenContract
    //   .approve(spender, useExact ? amountToApprove.raw.toString() : MaxUint256, {
    //     gasLimit: calculateGasMargin(estimatedGas)
    //   })
    //   .then((response: TransactionResponse) => {
    //     addTransaction(response, {
    //       summary: 'Approve ' + amountToApprove.currency.symbol,
    //       approval: { tokenAddress: token.address, spender: spender }
    //     })
    //   })
    //   .catch((error: Error) => {
    //     console.debug('Failed to approve token', error)
    //     throw error
    //   })
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade, allowedSlippage = 0) {
  const { chainId } = useActiveWeb3React()
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage]
  )
  const tradeIsV1 = getTradeVersion(trade) === Version.v1
  const v1ExchangeAddress = useV1TradeExchangeAddress(trade)
  return useApproveCallback(amountToApprove, tradeIsV1 ? v1ExchangeAddress : chainId && getRouterAddress(chainId))
}
