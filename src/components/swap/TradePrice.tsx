import React from 'react'
import { Price } from '@uniswap/sdk'
import { useContext } from 'react'
import { Repeat } from 'react-feather'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { StyledBalanceMaxMini } from './styleds'
import LazyImage from '../LazyImage'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const theme = useContext(ThemeContext)

  const formattedPrice = !showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  // const label = showInverted
  //   ? `${price?.quoteCurrency?.symbol} per ${price?.baseCurrency?.symbol}`
  //   : `${price?.baseCurrency?.symbol} per ${price?.quoteCurrency?.symbol}`
  const label = showInverted
    ? `1 ${price?.quoteCurrency?.symbol} = ${formattedPrice} ${price?.baseCurrency?.symbol}`
    : `1 ${price?.baseCurrency?.symbol} = ${formattedPrice} ${price?.quoteCurrency?.symbol}`

  return (
    <Text
      fontWeight={600}
      fontSize={14}
      color={'rgba(0, 0, 0, 0.6)'}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {show ? (
        <>
          <div onClick={(e) => {
            e.stopPropagation()
            setShowInverted(!showInverted)
          }} className='mr-2'>
            <LazyImage src='/images/airdrop/inverted.svg' />
          </div>
          {!formattedPrice ? '-' : label} 
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
