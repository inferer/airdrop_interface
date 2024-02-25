import router from 'next/router'
import { CurrencyAmount, JSBI, Token, Trade } from '@uniswap/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {  ButtonLight, ButtonSwap } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapCollectTabs } from '../../components/NavigationTabs'
import { BottomGrouping, SwapBody, Wrapper } from '../../components/swap/styleds'

import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useInputTokens } from '../../hooks/Tokens'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useCollectSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import {  useIsUserAction, useUserAction, useUserRoleMode } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { TYPE } from '../../theme'
import Score from './Score'
import Units from './Units'
import { UserAction } from '../../constants'
import { useAccountLabelScore } from '../../hooks/useAirdropTokenScore'


export default function Search() {
  const { account } = useActiveWeb3React()
  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()
  const { userAction, setUserAction }  = useUserAction()
  const [isProjectMode, toggleSetUserRoleMode] = useUserRoleMode()
  useEffect(() => {
    if (isProjectMode) {
      toggleSetUserRoleMode()
    }
    setUserAction(UserAction.USER_COLLECT)
  }, [isProjectMode])
  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    currencyBalances,
    parsedAmount,
    parsedAmountOUTPUT,
    parsedAmountOUTPUTDerived,
    currencies,
    inputError: collectInputError
  } = useCollectSwapInfo()
  const parsedAmounts = {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : parsedAmountOUTPUTDerived,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : parsedAmountOUTPUT
      }

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )


  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }


  // check if user has gone through approval process, used to show two step buttons, reset on token change

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))


  // warnings on slippage


  const handleInputSelect = useCallback(
    inputCurrency => {
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback((maxAmount?: string) => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmount ?? maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const inputTokens = useInputTokens()
  const { isProjectSwap, isProjectCreate, isUserSwap, isUserCollect } = useIsUserAction()
  useEffect(() => {
    if (inputTokens[0]) {
      onCurrencySelection(Field.INPUT, inputTokens[0])
    }
  }, [inputTokens, onCurrencySelection])

  const handleAction = useCallback(() => {
    if (isUserCollect) {
      const inputCurrency = currencies[Field.INPUT]
      // @ts-ignore
      router.push(`/collect/${inputCurrency?.address}`)
    }
  }, [isUserCollect, currencies])

  const accountScore = useAccountLabelScore(account || '', currencies[Field.INPUT]?.symbol?.slice(4) || '' )
  useEffect(() => {
    onUserInput(Field.INPUT, '')
    onUserInput(Field.OUTPUT, '')
  }, [router])

  const disabled = useMemo(() => {
    return !account || !!collectInputError || accountScore <= 0 || Number(formattedAmounts[Field.INPUT]) <= 0
  }, [account, collectInputError, accountScore, formattedAmounts])
  
  return (
    <>
      <SwapBody>
        <SwapCollectTabs />
        <Wrapper id="collect-page">
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              label={'You pay'}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="collect-currency-input"
            />
            <Score score={accountScore} />
            <CurrencyInputPanel
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={'You received'}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              otherCurrency={currencies[Field.INPUT]}
              disableCurrencySelect={true}
              id="collect-currency-output"
            />
            <Units />
          </AutoColumn>
          <BottomGrouping>
            {
              isUserCollect ?
                <ButtonSwap 
                  disabled={disabled}
                  onClick={e => {
                    e.stopPropagation()
                    if (disabled) return
                    if (!!collectInputError) return
                    handleAction()
                  }} >
                  <div className='btn-text'>
                    {
                      (isProjectSwap || isUserSwap) ? 'Swap' : isProjectCreate ? 'Create' : 'Collect'
                    }
                  </div>
                    
                </ButtonSwap> :
            !account ? (
              <ButtonSwap onClick={toggleWalletModal}>Connect Wallet</ButtonSwap>
            ) : null}
          </BottomGrouping>
        </Wrapper>
      </SwapBody>
    </>
  )
}
