import { TokenList, TokenInfo } from '@uniswap/token-lists'

import { ST_TOKEN_LIST, AIR_TOKEN_LIST, AIRLABEL_TOKEN_LIST, GET_AIRUSDT_2_USDT, ALGLABEL_TOKEN_LIST, GET_ALGTOKEN_2_AIRTOKEN, GET_AIRTOKEN_2_ALGTOKEN } from '../constants/tokenList'
import { AIRLABEL_TOKEN_LIST_URL, AIR_TOKEN_LIST_URL, ALGLABEL_TOKEN_LIST_URL } from '../constants/lists'
import { ChainId } from '@uniswap/sdk'

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
export default async function getTokenList(
  listUrl: string,
  resolveENSContentHash?: (ensName: string) => Promise<string>
): Promise<any> {
  let response
    try {
      response = await fetch('/tokens/tokenlist.json')
      if (!response.ok) {
      
      }
      const json = await response.json()
      return json as TokenList
    } catch (error) {
      console.debug('Failed to fetch list', listUrl, error)
      
    }
}

const template = {
  "name": "",
  "timestamp": "",
  "version": {
    "major": 1
  },
  "tags": {},
  "logoURI": "",
  "keywords": [
  ],
  "tokens": [ ]
}

export function filterTokenByChainId(tokens: TokenInfo[], chainId?: ChainId) {
  return tokens.filter(token => chainId ? token.chainId === chainId : !!token.chainId)
}

export async function getTokenListLocal(
  listUrl: string,
  chainId?: ChainId
): Promise<any> {
  let tokens = {}
  if (listUrl === AIR_TOKEN_LIST_URL) {
    tokens = filterTokenByChainId(AIR_TOKEN_LIST, chainId)
  } else if (listUrl === AIRLABEL_TOKEN_LIST_URL) {
    tokens = filterTokenByChainId(AIRLABEL_TOKEN_LIST, chainId)
  } else if (listUrl === ALGLABEL_TOKEN_LIST_URL) {
    tokens = filterTokenByChainId(ALGLABEL_TOKEN_LIST, chainId)
  } else {
    tokens = filterTokenByChainId(ST_TOKEN_LIST, chainId)
  }

  return {
    ...template,
    name: listUrl,
    timestamp: new Date().toLocaleString(),
    tokens: tokens
  }
}

export function getUSDTTokenFromAirToken(address: string) {
  return GET_AIRUSDT_2_USDT()[address]
}

export function getAirTokenFromAlgToken(address?: string) {
  return GET_ALGTOKEN_2_AIRTOKEN()[address || '']
}

export function getALgTokenFromAirToken(address?: string) {
  return GET_AIRTOKEN_2_ALGTOKEN()[address || '']
}

export function getUSDTTokenByAddress(address: string) {
  return filterTokenByChainId(ST_TOKEN_LIST).find(token => token.address.toLowerCase() === address.toLowerCase())
}

export function getLabelTokenByAddress(address: string) {
  return filterTokenByChainId(AIRLABEL_TOKEN_LIST).find(token => token.address.toLowerCase() === address.toLowerCase())
}

export function getAlgLabelTokenByAddress(address: string) {
  return filterTokenByChainId(ALGLABEL_TOKEN_LIST).find(token => token.address.toLowerCase() === address.toLowerCase())
}

export function getAlgTokenByLabel(label: string) {
  return filterTokenByChainId(ALGLABEL_TOKEN_LIST).find(token => token.symbol.slice(4) === label)
}

export function getAirTokenBySymbol(symbol: string) {
  return filterTokenByChainId(AIRLABEL_TOKEN_LIST).find(token => token.symbol === symbol)
}

export function getUSDTTokenByAddress2(address: string, chainId: number) {
  return filterTokenByChainId(AIR_TOKEN_LIST).find(token => token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId)
}