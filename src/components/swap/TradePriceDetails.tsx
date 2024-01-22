import React, { useState } from 'react'
import { Price, Trade } from '@uniswap/sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import LazyImage from '../LazyImage'
import { RowBetween } from '../Row'
import { ClickableText } from '../../views/Airdrop/styleds'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { useToggleSettingsMenu } from '../../state/application/hooks'
import TradePrice from './TradePrice'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { Field } from '../../state/swap/actions'

export interface TradePriceDetailsProps {
  trade?: Trade | undefined
}

export default function TradePriceDetails({ trade }: TradePriceDetailsProps) {
  const theme = useContext(ThemeContext)
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const [allowedSlippage] = useUserSlippageTolerance()  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <div className=' mt-3 border border-[#F5F5F5] rounded-xl px-4 py-[13px]'>
      {Boolean(trade) && (
        <RowBetween >
          <TradePrice
            price={trade?.executionPrice}
            showInverted={showInverted}
            setShowInverted={setShowInverted}
          />
        </RowBetween>
      )}
      <div className='h-[1px] bg-[#F5F5F5] mt-4'></div>
      {allowedSlippage && (
        <div>
          <RowBetween align="center" style={{marginTop: 12}}>
            <div className='text-[rgba(0,0,0,0.5)] text-[12px]'>Max. slippage</div>
            <ClickableText onClick={toggleSettings}>
              {allowedSlippage / 100}%
            </ClickableText>
          </RowBetween>
          <RowBetween align="center" style={{marginTop: 12}}>
            <div className='text-[rgba(0,0,0,0.5)] text-[12px]'>Fee</div>
            <ClickableText >
              {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade?.inputAmount.currency.symbol}` : '-'}
            </ClickableText>
          </RowBetween>
          <RowBetween align="center" style={{marginTop: 12}}>
            <div className='text-[rgba(0,0,0,0.5)] text-[12px]'>Minimum received</div>
            <ClickableText>
              { `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade?.outputAmount.currency.symbol}` ??
                  '-' }
            </ClickableText>
          </RowBetween>
        </div>
        
      )}
  </div>
  )
}
