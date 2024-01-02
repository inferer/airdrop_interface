import { Currency, Pair } from '@uniswap/sdk'
import React, { useState, useContext, useCallback, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { darken } from 'polished'
import { useCurrencyBalance, useCurrencyBalanceUSDT } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../NumericalInput'
import DropDown from '../../assets/images/dropdown.svg'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { useIsUserAction } from '../../state/user/hooks'
import LazyImage from '../LazyImage'
import { useAirTokenPercent } from '../../state/airdrop/hooks'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  padding: 0px 12px;
  height: 32px;
  font-size: 20px;
  font-weight: 600;
  font-family: Inter-SemiBold;
  background-color: ${({ selected, theme }) => (theme.bg1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.text3)};
  border-radius: 15px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;

  :focus,
  :hover {
    background-color: ${({ selected, theme }) => ('rgba(255,255,255,0.8)')};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 16px;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled.svg<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean, payInput?: boolean, id: string }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 12px;
  background: ${({ payInput, id }) => ( id === 'swap-currency-input' || 
                                        id === 'add-liquidity-input-tokena' || 
                                        id === 'collect-currency-output' || 
                                        id === 'userswap-currency-output'
    ? 'linear-gradient(96deg, rgba(63, 60, 255, 0.06) 0%, rgba(107, 190, 225, 0.06) 101.71%)' 
    : 'linear-gradient(135deg, rgba(107, 190, 225, 0.06) 0%, rgba(138, 232, 153, 0.06) 100%)' )} ;
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  /* border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1}; */
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

`

const StyledBalanceMax = styled.span`
  color: #8AE899;
  font-family: Inter-SemiBold;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  padding-left: 8px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

const BalanceWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 26px;

`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: (maxAmount?: string) => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  airPercent?: number
}

export default function  CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  // @ts-ignore
  const selectedCurrencyBalanceUSDT = useCurrencyBalanceUSDT(account ?? undefined, currency && currency.address)
  const theme = useContext(ThemeContext)


  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])


  const payInput = useMemo(() => {
    return id === 'swap-currency-input' || id === 'add-liquidity-input-tokena' || id === 'collect-currency-input' || id === 'userswap-currency-input'
  }, [id])

  const { isProjectCreate, isProjectSwap } = useIsUserAction()

  const handleOnMax = useCallback(async () => {
    if (onMax) {
      if (isProjectCreate && payInput && selectedCurrencyBalanceUSDT) {
        onMax(selectedCurrencyBalanceUSDT?.toExact())
      } else {
        onMax()
      }
    }
  }, [onMax, isProjectCreate, payInput, selectedCurrencyBalanceUSDT])

  const airPercent = useAirTokenPercent()

  const percentBalance = useMemo(() => {
    let balance1 = 0
    let balance2 = 0
    if (airPercent) {
      balance2 = Number((Number(value) * airPercent / 100).toFixed(2))
      balance1 = Number((Number(value) - balance2).toFixed(2))
    }

    return {
      balance1,
      balance2
    }
    
  }, [airPercent, value, selectedCurrencyBalance])

  return (
    <InputPanel id={id} payInput={payInput}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.darkGray fontWeight={600} fontSize={16}>
                {label}
              </TYPE.darkGray>
              
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                onUserInput={val => {
                  onUserInput(val)
                }}
              />
              
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={20} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'20px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : payInput && isProjectCreate ? currency?.symbol?.slice(4) : currency?.symbol) || t('selectToken')}
                </StyledTokenName>
              )}
              {!disableCurrencySelect &&  <img src='/images/airdrop/arrow-down.svg' /> }
            </Aligner>
          </CurrencySelect>
        </InputRow>
        <BalanceWrap>
          <div>
            {
              payInput && isProjectCreate && airPercent && airPercent > 0 ? 
              <div className='bg-[rgba(200,206,255,0.20)] rounded-sm h-[26px] px-[6px] flex items-center text-[rgba(0,0,0,0.60)] text-[14px]'>
                <div className=' flex items-center'>
                  <CurrencyLogo currency={selectedCurrencyBalanceUSDT?.currency} size={'14px'} />
                  <span className='mx-1'>{percentBalance.balance1}</span>
                  {selectedCurrencyBalanceUSDT?.currency?.symbol}
                </div>
                <LazyImage src='/images/airdrop/add2.svg' className='mx-1' />
                <div className=' flex items-center'>
                  <CurrencyLogo currency={selectedCurrencyBalance?.currency} size={'14px'} />
                  <span className='mx-1'>{percentBalance.balance2}</span>
                  {selectedCurrencyBalance?.currency?.symbol}
                </div>
                
              </div> : null
            }
          </div>
          
            <div>
            {account && (
              <TYPE.body
                onClick={handleOnMax}
                color={theme.text1}
                fontWeight={400}
                fontSize={16}
                style={{ display: 'inline', cursor: 'pointer' }}
              >
                {
                  isProjectCreate && payInput 
                    ? (!hideBalance && !!currency && selectedCurrencyBalanceUSDT
                      ? 'Balance: ' + selectedCurrencyBalanceUSDT?.toSignificant(6)
                      : ' -') 
                    : (!hideBalance && !!currency && selectedCurrencyBalance
                      ? 'Balance: ' + selectedCurrencyBalance?.toSignificant(6)
                      : ' -')
                }
                {/* {!hideBalance && !!currency && selectedCurrencyBalance
                  ? 'Balance: ' + selectedCurrencyBalance?.toSignificant(6)
                  : ' -'} */}
              </TYPE.body>
            )}
            {account && currency && label !== 'You received' && (
                <StyledBalanceMax onClick={handleOnMax}>MAX</StyledBalanceMax>
              )}
              </div>
        </BalanceWrap>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          payInput={payInput}
        />
      )}
    </InputPanel>
  )
}
