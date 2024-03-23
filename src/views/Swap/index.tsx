import router, { useRouter } from 'next/router'
import { CurrencyAmount, JSBI, Token, Trade } from '@uniswap/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, Type } from 'react-feather'
import { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed, ButtonSwap } from '../../components/Button'
import { AutoColumn } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapCreateTabs, SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import { ArrowWrapper, BottomGrouping, SwapBody, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import TokenWarningModal from '../../components/TokenWarningModal'

import { BETTER_TRADE_LINK_THRESHOLD, INITIAL_ALLOWED_SLIPPAGE } from '../../constants'
import { getTradeVersion, isTradeBetter } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useInputTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useShowToast, useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useIsUserAction, useLoginUserInfo, useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'

import Loader, { LoadingProject, LoadingUser } from '../../components/Loader'

import UseAirAssets from './UseAirAssets'

import TradePriceDetails from '../../components/swap/TradePriceDetails'
import { useAirTokenPercent } from '../../state/airdrop/hooks'

export default function Swap() {
  const router = useRouter()
  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const { account, deactivate } = useActiveWeb3React()
  const userLoginInfo = useLoginUserInfo()
  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()
  const airAssetsRef = useRef<any>(null)
  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()
  console.log(swapInputError)
  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)
  const toggledVersion = useToggledVersion()
  const trade = showWrap
    ? undefined
    : {
        [Version.v1]: v1Trade,
        [Version.v2]: v2Trade
      }[toggledVersion]

  const betterTradeLinkVersion: Version | undefined =
    toggledVersion === Version.v2 && isTradeBetter(v2Trade, v1Trade, BETTER_TRADE_LINK_THRESHOLD)
      ? Version.v1
      : toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade)
      ? Version.v2
      : undefined

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
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

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(4) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  )
  const { handleShow } = useShowToast()
  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)
  const [swaping, setSwaping] = useState(false)
  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }

    setSwaping(true)
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback() 
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
        const inputValue = formattedAmounts[Field.INPUT]
        const outputValue = formattedAmounts[Field.OUTPUT]
        const inputCurrency = currencies[Field.INPUT]
        const outputCurrency = currencies[Field.OUTPUT]
        const content = `Swap ${parseFloat(inputValue).toFixed(3)} ${inputCurrency?.symbol} for ${parseFloat(outputValue).toFixed(3)} ${outputCurrency?.symbol}`
        handleShow({ type: 'success', content: content, title: 'Success', action: 'swap', hash: hash })
        setSwaping(false)
        onUserInput(Field.INPUT, '')
        onUserInput(Field.OUTPUT, '')
        
      })
      .catch(error => {
        handleShow({ type: 'error', content: error.message, title: 'Error' })
        setSwaping(false)
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))
  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])
  const airPercent = useAirTokenPercent()
  const handleInputSelect = useCallback(
    inputCurrency => {
      // @ts-ignore
      if (currencies[Field.INPUT] && airPercent > 0 && inputCurrency?.address?.toLowerCase() !== currencies[Field.INPUT].address.toLowerCase()) {
        if (airAssetsRef.current) {
          airAssetsRef.current.initWrapInfo()
        }
      }
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      // 
    },
    [onCurrencySelection, currencies, airPercent]
  )

  const handleMaxInput = useCallback((maxAmount?: string) => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmount ?? maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(outputCurrency => {
    // @ts-ignore
    if (currencies[Field.OUTPUT] && airPercent > 0 && outputCurrency?.address?.toLowerCase() !== currencies[Field.OUTPUT].address.toLowerCase()) {
      if (airAssetsRef.current) {
        airAssetsRef.current.initWrapInfo()
      }
    }
    onCurrencySelection(Field.OUTPUT, outputCurrency)
  }, [
    onCurrencySelection,
    currencies,
    airPercent
  ])

  const inputTokens = useInputTokens()
  const { isProjectSwap, isProjectCreate, isUserSwap, isUserCollect } = useIsUserAction()
  useEffect(() => {
    if (inputTokens[0]) {
      onCurrencySelection(Field.INPUT, inputTokens[0])
    }
  }, [inputTokens, onCurrencySelection])

  const handleAction = useCallback(() => {
    if (isProjectCreate) {
      router.push('/project/create/' + currencies[Field.OUTPUT]?.symbol?.slice(4).toLowerCase())
    }
    if (isUserCollect) {
      router.push('/user/collect')
    }
  }, [isProjectCreate, isUserCollect, currencies])

  useEffect(() => {
    onUserInput(Field.INPUT, '')
    onUserInput(Field.OUTPUT, '')
  }, [router])

  const disabled = useMemo(() => {
    return !account || swaping || !!swapInputError || !isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError || (noRoute && userHasSpecifiedInputOutput)
  }, [swaping, swapInputError, isValid, priceImpactSeverity, isExpertMode, swapCallbackError, noRoute, userHasSpecifiedInputOutput, account])

  return (
    <>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <SwapBody>
        {/* <SwapPoolTabs active={'swap'} /> */}
        <SwapCreateTabs />
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />
          <AutoColumn gap={'6px'}>
            <CurrencyInputPanel
              label={'You pay'}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id={isProjectSwap || isProjectCreate ? "swap-currency-input" : "userswap-currency-input"}
            />
            <AutoColumn justify="space-between">
              <AutoRow justify={isExpertMode ? 'space-between' : 'center'}>
                {
                  isProjectCreate && 
                    <UseAirAssets ref={airAssetsRef} value={formattedAmounts[Field.INPUT]} />
                }
                

                {/* <ArrowWrapper clickable>
                  <ArrowDown
                    size="16"
                    onClick={() => {
                      setApprovalSubmitted(false) // reset 2 step UI for approvals
                      onSwitchTokens()
                    }}
                    color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                  />
                </ArrowWrapper> */}
                {/* {recipient === null && !showWrap && isExpertMode ? (
                  <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                    + Add a send (optional)
                  </LinkStyledButton>
                ) : null} */}
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={'You received'}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              id={isProjectSwap || isProjectCreate ? "swap-currency-output" : "userswap-currency-output"}
            />

            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.text2} />
                  </ArrowWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                    - Remove send
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
              </>
            ) : null}

            {trade && (
              <TradePriceDetails trade={trade} />
              // <div className=' mt-3 border border-[#F5F5F5] rounded-xl px-4 py-[13px]'>
              //     {Boolean(trade) && (
              //       <RowBetween >
              //         <TradePrice
              //           price={trade?.executionPrice}
              //           showInverted={showInverted}
              //           setShowInverted={setShowInverted}
              //         />
              //       </RowBetween>
              //     )}
              //     <div className='h-[1px] bg-[#F5F5F5] mt-4'></div>
              //     {allowedSlippage && (
              //       <div>
              //         <RowBetween align="center" style={{marginTop: 12}}>
              //           <div className='text-[rgba(0,0,0,0.5)] text-[12px]'>Max. slippage</div>
              //           <ClickableText onClick={toggleSettings}>
              //             {allowedSlippage / 100}%
              //           </ClickableText>
              //         </RowBetween>
              //         <RowBetween align="center" style={{marginTop: 12}}>
              //           <div className='text-[rgba(0,0,0,0.5)] text-[12px]'>Fee</div>
              //           <ClickableText onClick={toggleSettings}>
              //             {allowedSlippage / 100}%
              //           </ClickableText>
              //         </RowBetween>
              //         <RowBetween align="center" style={{marginTop: 12}}>
              //           <div className='text-[rgba(0,0,0,0.5)] text-[12px]'>Minimum received</div>
              //           <ClickableText onClick={toggleSettings}>
              //             {allowedSlippage / 100}%
              //           </ClickableText>
              //         </RowBetween>
              //       </div>
                    
              //     )}
              // </div>
            )}
          </AutoColumn>
          <BottomGrouping>
            {
              
            (!account || !userLoginInfo.address)  ? (
              <ButtonSwap onClick={toggleWalletModal}>
                <div className='btn-text'>
                  Connect Airdrop Network
                </div>
                
              </ButtonSwap>
            ) : showApproveFlow && !isProjectCreate && approval !== ApprovalState.APPROVED ? (
              <RowBetween>
                <ButtonSwap
                  onClick={approveCallback}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                >
                  {approval === ApprovalState.PENDING ? (
                    isProjectSwap ? <LoadingProject /> : <LoadingUser />
                  ) : (
                    <span className='btn-text'>{'Approve ' + currencies[Field.INPUT]?.symbol}</span>
                  )}
                </ButtonSwap>
                {/* <ButtonSwap
                  onClick={() => {
                    if (isProjectCreate || isUserCollect) {
                      handleAction()
                      return
                    }
                    handleSwap()
                  }}
                  width="48%"
                  id="swap-button"
                  disabled={
                    !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                  }
                >
                  <Text fontSize={16} fontWeight={500} className='btn-text'>
                    {isProjectSwap || isUserSwap ? 'Swap' : isProjectCreate ? 'Create' : 'Collect'}
                  </Text>
                </ButtonSwap> */}
              </RowBetween>
            ) : (
              <ButtonSwap
                onClick={() => {
                  if (disabled) return
                  if (isProjectCreate) {
                    handleAction()
                    return
                  }
                  if (isExpertMode) {
                    handleSwap()
                  } else {
                    setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined
                    })
                  }
                }}
                id="swap-button"
                disabled={disabled}
              >
                {
                  swaping ? 
                    isProjectSwap ? <LoadingProject /> : <LoadingUser /> :
                    <div className='btn-text'>
                      {isProjectSwap || isUserSwap
                        ? 'Swap' : isProjectCreate ? 'Create' : 'Collect'}
                    </div>
                }
                
              </ButtonSwap>
            )}
            {/* {showApproveFlow && <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />}
            {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            {betterTradeLinkVersion && <BetterTradeLink version={betterTradeLinkVersion} />} */}
          </BottomGrouping>
        </Wrapper>
      </SwapBody>
      {/* <AdvancedSwapDetailsDropdown trade={trade} /> */}
    </>
  )
}
