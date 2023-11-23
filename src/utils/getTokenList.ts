import { TokenList, TokenInfo } from '@uniswap/token-lists'

import { NETWORK_CHAIN_ID } from '../connectors'
import { ST_TOKEN_LIST, AIR_TOKEN_LIST, AIRLABEL_TOKEN_LIST } from '../constants/tokenList'
import { AIRLABEL_TOKEN_LIST_URL, AIR_TOKEN_LIST_URL } from '../constants/lists'

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

export function filterTokenByChainId(tokens: TokenInfo[]) {
  return tokens.filter(token => token.chainId === NETWORK_CHAIN_ID)
}

export async function getTokenListLocal(
  listUrl: string,
): Promise<any> {
  let tokens = {}
  if (listUrl === AIR_TOKEN_LIST_URL) {
    tokens = filterTokenByChainId(AIR_TOKEN_LIST)
  } else if (listUrl === AIRLABEL_TOKEN_LIST_URL) {
    tokens = filterTokenByChainId(AIRLABEL_TOKEN_LIST)
  } else {
    tokens = filterTokenByChainId(ST_TOKEN_LIST)
  }

  return {
    ...template,
    name: listUrl,
    timestamp: new Date().toLocaleString(),
    tokens: tokens
  }
  
}
