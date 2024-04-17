import { Currency, ETHER, Token } from '@uniswap/sdk'
import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { FixedSizeList } from 'react-window'
import { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useAirAllTokens, useAirLabelAllTokens, useAlgLabelAllTokens, useAllTokens, useToken } from '../../hooks/Tokens'
import { CloseIcon, LinkStyledButton, TYPE } from '../../theme'
import { isAddress } from '../../utils'
import Card from '../Card'
import Column from '../Column'
import Row, { RowBetween } from '../Row'
import CurrencyList from './CurrencyList'
import { filterTokens } from './filtering'
import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import { useIsRoleProjectMode, useIsUserAction } from '../../state/user/hooks'
import { useLocation } from '../../hooks/useLocation'
import { LazyImage4 } from '../LazyImage'
import { TEL_URL } from '../../constants'
import LP0CurrencyList from './LP0CurrencyList'

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  payInput?: boolean
  onChangeList: () => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  payInput,
  onDismiss,
  isOpen,
  onChangeList
}: CurrencySearchProps) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const { isProjectSwap, isProjectCreate, isUserSwap, isUserCollect } = useIsUserAction()
  const isProjectMode  = useIsRoleProjectMode()
  const location = useLocation()
  const isSwap = location.query && location.query.action && (location.query.action[0] === 'swap' || location.query.action[0] === 'collect')
  const isAddLP0 = location.pathname === "/add/[[...address]]" && location.query.lp === '0'
  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
  const allTokens = useAllTokens()
  const airLabelAllTokens = useAirLabelAllTokens()
  const algLabelAllTokens = useAlgLabelAllTokens()

  const currentAllTokens = useMemo(() => {
    if (isSwap) {
      if (isProjectSwap || isProjectCreate) {
        if (payInput) {
          return allTokens
        } else {
          return airLabelAllTokens
        }
      } if (isUserSwap) {
        if (payInput) {
          return airLabelAllTokens
        } else {
          return allTokens
        }
      } if (isUserCollect) {
        if (payInput) {
          return algLabelAllTokens
        } else {
          return airLabelAllTokens
        }
      }
    }
    return payInput ? allTokens : airLabelAllTokens
  }, [allTokens, airLabelAllTokens, algLabelAllTokens, payInput, isProjectMode, isSwap, isProjectSwap, isProjectCreate, isUserSwap, isUserCollect])

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch
      })
    }
  }, [isAddressSearch])

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    return (s === '' || s === 'e' || s === 'et' || s === 'eth') && isProjectCreate
  }, [searchQuery, isProjectCreate])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(currentAllTokens), searchQuery)
  }, [isAddressSearch, searchToken, currentAllTokens, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter(token => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter(token => token.symbol?.toLowerCase() !== symbolMatch[0])
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  )
  
  const isAssetToken = useMemo(() => {
    if (isProjectMode && payInput) return true
    if (isUserSwap && !payInput) return true
    return false
  }, [isProjectMode, payInput, isUserSwap])

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px" style={{padding: 30}}>
        <RowBetween>
          <div className=' font-fsemibold text-[18px]'>
            { isAssetToken ? 'Select an asset token' : 'Select an air token'}
          </div>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        {/* <SearchInput
          type="text"
          id="token-search-input"
          placeholder={t('tokenSearchPlaceholder')}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )} */}
        {/* <RowBetween>
          <Text fontSize={14} fontWeight={500}>
            Token Name
          </Text>
          <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder(iso => !iso)} />
        </RowBetween> */}
      </PaddedColumn>

      {/* <Separator /> */}
      <div className='px-[30px]'>
        <div className=' flex justify-between items-center bg-[rgba(85,123,241,0.03)] px-[16px] py-[10px] text-[14px] font-fsemibold text-[rgba(0,0,0,0.4)]'>
          <div>Name</div>
          <div>Balance</div>
        </div>

        
      </div>
      <div style={{ flex: '1' }} className='px-[30px]' >
        {/* <AutoSizer disableWidth defaultHeight={346}>
          {({ height }) => ( */}
            {
              isAddLP0 && payInput ? 
              <LP0CurrencyList
                isAssetToken={isAssetToken}
                payInput={payInput}
                height={346}
                showETH={showETH}
                currencies={filteredSortedTokens}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
              /> :
                <CurrencyList
                  isAssetToken={isAssetToken}
                  payInput={payInput}
                  height={346}
                  showETH={showETH}
                  currencies={filteredSortedTokens}
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={otherSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                  fixedListRef={fixedList}
                />
            }
            
          {/* )}
        </AutoSizer> */}
      </div>
      <div className=' text-[11px] text-[rgba(0,0,0,0.4)] font-fnormal cursor-pointer flex items-center justify-center pb-4'
        onClick={e => {
          e.stopPropagation()
          window.open(TEL_URL, '_blank')
        }}
      >
        Apply for new air token
        <LazyImage4 className='ml-1' src='/images/airdrop/open.svg' activeSrc='/images/airdrop/open2.svg' />
      </div>
      {/* <Separator />
      <Card>
        <RowBetween>
          {selectedListInfo.current ? (
            <Row>
              {selectedListInfo.current.logoURI ? (
                <ListLogo
                  style={{ marginRight: 12 }}
                  logoURI={selectedListInfo.current.logoURI}
                  alt={`${selectedListInfo.current.name} list logo`}
                />
              ) : null}
              <TYPE.main id="currency-search-selected-list-name">{selectedListInfo.current.name}</TYPE.main>
            </Row>
          ) : null}
          <LinkStyledButton
            style={{ fontWeight: 500, color: theme.text2, fontSize: 16 }}
            onClick={onChangeList}
            id="currency-search-change-list-button"
          >
            {selectedListInfo.current ? 'Change' : 'Select a list'}
          </LinkStyledButton>
        </RowBetween>
      </Card> */}
    </Column>
  )
}
