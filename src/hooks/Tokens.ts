import { parseBytes32String } from '@ethersproject/strings'
import { Currency, ETHER, Token, currencyEquals } from '@uniswap/sdk'
import { useMemo } from 'react'
import { useAirLabelTokenList, useAirTokenList, useAlgLabelTokenList, useSelectedTokenList, useUSDTTokenList } from '../state/lists/hooks'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useAddUserToken, useIsUserAction, useUserAddedTokens } from '../state/user/hooks'
import { isAddress } from '../utils'

import { useActiveWeb3React } from './index'
import { useBytes32TokenContract, useTokenContract } from './useContract'

export function useAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useSelectedTokenList()
  return useMemo(() => {
    if (!chainId) return {}
    return allTokens[chainId]
    // const currentTokens = Object.values(allTokens[chainId])
    // console.log(currentTokens)
    // return (
    //   userAddedTokens
    //     // reduce into all ALL_TOKENS filtered by the current chain
    //     .reduce<{ [address: string]: Token }>(
    //       (tokenMap, token) => {
    //         // console.log(tokenMap, token)
    //         tokenMap[token.address] = token
    //         return tokenMap
    //       },
    //       // must make a copy because reduce modifies the map, and we do not
    //       // want to make a copy in every iteration
    //       { ...allTokens[chainId] }
    //     )
    // )
  }, [chainId, userAddedTokens, allTokens])
}


export function useAirAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useAirTokenList()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

export function useAirLabelAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useAirLabelTokenList()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

export function useAlgLabelAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useAlgLabelTokenList()
  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

export function useUSDTAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()
  const allTokens = useUSDTTokenList()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          { ...allTokens[chainId] }
        )
    )
  }, [chainId, userAddedTokens, allTokens])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency): boolean {
  const userAddedTokens = useUserAddedTokens()
  return !!userAddedTokens.find(token => currencyEquals(currency, token))
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : bytes32 && BYTES32_REGEX.test(bytes32)
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const airLabelTokens = useAirLabelAllTokens()

  const tokens = useMemo(() => ({ ...allTokens, ...airLabelTokens }), [allTokens, airLabelTokens])

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result
  ])
}

export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const isETH = currencyId?.toUpperCase() === 'ETH'
  const token = useToken(currencyId)
  return useMemo(() => {
    if (isETH) return ETHER
    return token
  }, [isETH, token])

  // if (isETH) return ETHER
  // return useToken(currencyId)
}

export function useInputTokens() {
  const allTokens = useAllTokens()
  const airLabelAllTokens = useAirLabelAllTokens()
  const algLabelAllTokens = useAlgLabelAllTokens()

  const { isProjectSwap, isProjectCreate, isUserSwap, isUserCollect } = useIsUserAction()

  return useMemo(() => {
    if (isProjectSwap || isProjectCreate) return Object.values(allTokens) 
    if (isUserSwap) return Object.values(airLabelAllTokens)
    return Object.values(algLabelAllTokens) 

  }, [allTokens, airLabelAllTokens, algLabelAllTokens, isProjectSwap, isProjectCreate, isUserSwap, isUserCollect])

}
