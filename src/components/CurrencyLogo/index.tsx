import { Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'

const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`

export const getTokenLogoURL2 = (currency: any, type?: string) => {
  if (currency?.symbol === 'WETH') return EthereumLogo.src
  let logoName = currency?.symbol?.toLowerCase()
  if (type === 'payInputCreate') {
    if (currency?.symbol?.indexOf('Air-') === 0 || currency?.symbol?.indexOf('Alg-') === 0) {
      logoName = currency?.symbol?.slice(4).toLowerCase()
    }
    return `/images/tokens/swap/${logoName}.svg`
  }
  if (type === 'create') {
    return `/images/tokens/create/${logoName}.svg`
  }
  if (type === 'confirm') {
    return '/images/tokens/confirm.svg'
  }
  if (type === 'project') {
    return '/images/tokens/project.svg'
  }
  if (type === 'campaign') {
    return '/images/tokens/swap/air-campaign.svg'
  }
  return `/images/tokens/swap/${logoName}.svg`
}

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  type,
  currency,
  size = '24px',
  style
}: {
  type?: string
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    return [getTokenLogoURL2(currency, type)]
  }, [currency, type, uriLocations])

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
