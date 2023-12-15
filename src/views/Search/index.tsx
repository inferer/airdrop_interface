import router from 'next/router'
import { CurrencyAmount, JSBI, Token, Trade } from '@uniswap/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ReactGA from 'react-ga'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed, ButtonSwap } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapCollectTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import { BottomGrouping, SwapBody, Wrapper } from '../../components/swap/styleds'

import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useInputTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useCollectSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useIsUserAction, useUserAction, useUserDeadline, useUserRoleMode, useUserSlippageTolerance } from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { TYPE } from '../../theme'
import Score from './Score'
import Units from './Units'
import { UserAction } from '../../constants'


export default function Swap() {
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
    inputError: swapInputError
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
      router.push(`/collect/${inputCurrency.address}`)
    }
  }, [isUserCollect, currencies])


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
            <Score />
            <CurrencyInputPanel
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={'You received'}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              otherCurrency={currencies[Field.INPUT]}
              id="collect-currency-output"
            />
            <Units />
          </AutoColumn>
          <BottomGrouping>
            {
              isUserCollect ?
                <ButtonSwap onClick={handleAction} >
                  <TYPE.textGrad1 fontWeight={600} fontSize={20}>
                    {
                      (isProjectSwap || isUserSwap) ? 'Swap' : isProjectCreate ? 'Create' : 'Collect'
                    }
                  </TYPE.textGrad1>
                </ButtonSwap> :
            !account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : null}
          </BottomGrouping>
        </Wrapper>
      </SwapBody>
    </>
  )
}
