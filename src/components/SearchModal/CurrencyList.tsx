import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@uniswap/sdk'
import React, { CSSProperties, MutableRefObject, useCallback, useEffect, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useSelectedTokenList, WrappedTokenInfo } from '../../state/lists/hooks'
import { useAddUserToken, useIsUserAction, useRemoveUserAddedToken } from '../../state/user/hooks'
import { useCurrencyBalance, useCurrencyBalanceUSDT } from '../../state/wallet/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import { useIsUserAddedToken } from '../../hooks/Tokens'
import Column from '../Column'
import { RowFixed } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import { MouseoverTooltip } from '../Tooltip'
import { FadedSpan, MenuItem } from './styleds'
import Loader, { Loading, LoadingProjectBalance, LoadingUserBalance } from '../Loader'
import { isTokenOnList } from '../../utils'
import { LazyImage2 } from '../LazyImage'
import { useLocation } from '../../hooks/useLocation'

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(18)}</StyledBalanceText>
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  payInputCreate,
  isAssetToken
}: {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  payInputCreate?: boolean
  isAssetToken?: boolean
}) {
  const location = useLocation()
  

  const { account, chainId } = useActiveWeb3React()
  const key = currencyKey(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)
  // @ts-ignore
  const balanceUSDT = useCurrencyBalanceUSDT(account ?? undefined, currency.address, payInputCreate)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item token-item-${key} ${isAssetToken ? 'token-item-asset' : 'token-item-air'}`}
      onClick={() => (isSelected ? onSelect() : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      {
        isSelected && <LazyImage2 src={isAssetToken ? '/images/airdrop/project_token_select.svg' : '/images/airdrop/user_token_select.svg'} className=' absolute left-2 top-[50%] -mt-[3px]' />
      }
      <CurrencyLogo currency={currency} size={'20px'} type={payInputCreate ? 'payInputCreate' : ''} />
      <Column>
        <Text title={currency.name} fontWeight={500}>
          {payInputCreate ? currency.symbol?.slice(4) : currency.symbol}
        </Text>
        {/* <FadedSpan>
          {!isOnSelectedList && customAdded ? (
            <TYPE.main fontWeight={500}>
              Added by user
              <LinkStyledButton
                onClick={event => {
                  event.stopPropagation()
                  if (chainId && currency instanceof Token) removeToken(chainId, currency.address)
                }}
              >
                (Remove)
              </LinkStyledButton>
            </TYPE.main>
          ) : null}
          {!isOnSelectedList && !customAdded ? (
            <TYPE.main fontWeight={500}>
              Found by address
              <LinkStyledButton
                onClick={event => {
                  event.stopPropagation()
                  if (currency instanceof Token) addToken(currency)
                }}
              >
                (Add)
              </LinkStyledButton>
            </TYPE.main>
          ) : null}
        </FadedSpan> */}
      </Column>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {
          payInputCreate 
            ? (balanceUSDT ? <Balance balance={balanceUSDT} /> : account ? (isAssetToken ? <LoadingProjectBalance /> : <LoadingUserBalance /> ) : null)
            : (balance ? <Balance balance={balance} /> : account ? (isAssetToken ? <LoadingProjectBalance /> : <LoadingUserBalance /> ) : null)
        }
        {/* {balance ? <Balance balance={balance} /> : account ? <Loader /> : null} */}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  payInput,
  isAssetToken
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  payInput?: boolean
  isAssetToken?: boolean
}) {
  const { isProjectCreate } = useIsUserAction()
  
  const itemData = useMemo(() => (showETH ? [ ...currencies] : currencies), [currencies, showETH])

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)
      return (
        <CurrencyRow
          isAssetToken={isAssetToken}
          payInputCreate={ payInput && isProjectCreate }
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [onCurrencySelect, otherCurrency, selectedCurrency]
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

  return (
    <FixedSizeList
      className='token-list-wrap'
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
