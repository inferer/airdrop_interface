import { JSBI, Pair, Percent } from '@uniswap/sdk'
import { darken } from 'polished'
import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import Link from 'next/link'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { usePairInfererBalance, useTokenBalance } from '../../state/wallet/hooks'
import { ExternalLink } from '../../theme'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonSecondary } from '../Button'

import Card, { GreyCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'
import { getOwnerAddress } from '../../utils'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg2};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.bg2)};
  }
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolInfererBalance = usePairInfererBalance(account ?? undefined, pair.liquidityToken)
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
  // // @ts-ignore
  // console.log(pair?.tokenAmounts[0].toSignificant(4) , 111)
  // // @ts-ignore
  // console.log(pair?.tokenAmounts[1].toSignificant(4) , 111)

  console.log(userPoolInfererBalance?.toSignificant(20))

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolInfererBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolInfererBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolInfererBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolInfererBalance, false)
        ]
      : [undefined, undefined]

  const [token0Deposited2, token1Deposited2] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolInfererBalance && (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <div className='border p-2 border-red-600 rounded-lg mb-3 w-[450px]'>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolInfererBalance ? userPoolInfererBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
              
              
            </FixedHeightRow>
              
            <FixedHeightRow>
              <Text color="#888D9B" fontSize={16} fontWeight={500}>
                {currency0.symbol}:
              </Text>
              {token0Deposited ? (
                <RowFixed>
                  <Text color="#888D9B" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <Text color="#888D9B" fontSize={16} fontWeight={500}>
                {currency1.symbol}:
              </Text>
              {token1Deposited ? (
                <RowFixed>
                  <Text color="#888D9B" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
          </div>
          </AutoColumn>
        <AutoColumn>
              {
                userPoolBalance?.greaterThan('0') && 
                <div className='border p-2 border-green-600 rounded-lg'>
                  <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                    <RowFixed>
                      <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                      <Text fontWeight={500} fontSize={20}>
                        {currency0.symbol}/{currency1.symbol}
                      </Text>
                    </RowFixed>
                    <RowFixed>
                      <Text fontWeight={500} fontSize={20}>
                        {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                      </Text>
                    </RowFixed>
                    
                  </FixedHeightRow>
                  <FixedHeightRow>
                    <Text color="#888D9B" fontSize={16} fontWeight={500}>
                      {currency0.symbol}:
                    </Text>
                    {token0Deposited2 ? (
                      <RowFixed>
                        <Text color="#888D9B" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                          {token0Deposited2?.toSignificant(6)}
                        </Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </FixedHeightRow>
                  <FixedHeightRow>
                    <Text color="#888D9B" fontSize={16} fontWeight={500}>
                      {currency1.symbol}:
                    </Text>
                    {token1Deposited2 ? (
                      <RowFixed>
                        <Text color="#888D9B" fontSize={16} fontWeight={500} marginLeft={'6px'}>
                          {token1Deposited2?.toSignificant(6)}
                        </Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </FixedHeightRow>
                </div>
              }
              
            </AutoColumn>
        </GreyCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const { account, chainId } = useActiveWeb3React()
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)
  const userPoolInfererBalance = usePairInfererBalance(account ?? undefined, pair.liquidityToken)
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  // const userPoolInfererBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const isOwner = useMemo(() => {
    return account && chainId &&  account === getOwnerAddress(chainId)
  },  [account, chainId])

  const poolTokenPercentage =
    !!userPoolInfererBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolInfererBalance.raw)
      ? new Percent(userPoolInfererBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolInfererBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolInfererBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolInfererBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolInfererBalance, false)
        ]
      : [undefined, undefined]
  const poolTokenPercentage2 =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined
  const [token0Deposited2, token1Deposited2] =
      !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
        ? [
            pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
            pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
          ]
        : [undefined, undefined]

  return (
    <HoverCard border={border}>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer' }}>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </RowFixed>
          <RowFixed>
            {showMore ? (
              <ChevronUp size="20" style={{ marginLeft: '10px' }} />
            ) : (
              <ChevronDown size="20" style={{ marginLeft: '10px' }} />
            )}
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">
            <div className=' border p-2 border-red-600 rounded-lg'>
              <FixedHeightRow>
                <RowFixed>
                  <Text fontSize={16} fontWeight={500}>
                    Pooled {currency0.symbol}:
                  </Text>
                </RowFixed>
                {token0Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                    <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>

              <FixedHeightRow>
                <RowFixed>
                  <Text fontSize={16} fontWeight={500}>
                    Pooled {currency1.symbol}:
                  </Text>
                </RowFixed>
                {token1Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                    <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                  </RowFixed>
                ) : (
                  '-'
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Your pool tokens:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {userPoolInfererBalance ? userPoolInfererBalance.toSignificant(4) : '-'}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  Your pool share:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
                </Text>
              </FixedHeightRow>
            </div>
            {
              userPoolBalance?.greaterThan('0') && 
              <div className=' border p-2 border-green-600 rounded-lg'>
              <FixedHeightRow>
                <RowFixed>
                  <Text fontSize={16} fontWeight={500}>
                    Pooled {currency0.symbol}:
                  </Text>
                </RowFixed>
                {token0Deposited2 ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                      {token0Deposited2?.toSignificant(6)}
                    </Text>
                    <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                  </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>

                <FixedHeightRow>
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500}>
                      Pooled {currency1.symbol}:
                    </Text>
                  </RowFixed>
                  {token1Deposited2 ? (
                    <RowFixed>
                      <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                        {token1Deposited2?.toSignificant(6)}
                      </Text>
                      <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    Your pool tokens:
                  </Text>
                  <Text fontSize={16} fontWeight={500}>
                    {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                  </Text>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize={16} fontWeight={500}>
                    Your pool share:
                  </Text>
                  <Text fontSize={16} fontWeight={500}>
                    {poolTokenPercentage2 ? poolTokenPercentage2.toFixed(2) + '%' : '-'}
                  </Text>
                </FixedHeightRow>
              </div>
            }
            {
                isOwner && 
                <RowBetween marginTop="10px">
                  <Link href={`/add/${currencyId(currency0)}/${currencyId(currency1)}?lp=0`}>
                    <ButtonSecondary width="48%">
                      Add LP0
                    </ButtonSecondary>
                  </Link>
                  <Link href={`/remove/${currencyId(currency0)}/${currencyId(currency1)}?lp=0`}>
                    <ButtonSecondary width="48%">
                      Remove LP0
                    </ButtonSecondary>
                  </Link>
                </RowBetween>
                
              }

            <RowBetween marginTop="10px">
              <Link href={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                <ButtonSecondary width="48%">
                  Add
                </ButtonSecondary>
              </Link>
              
              {
                userPoolBalance?.greaterThan('0') && 
                <Link href={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  <ButtonSecondary width="48%">
                    Remove
                  </ButtonSecondary>
                </Link>
              }
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}
