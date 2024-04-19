import { ChainId } from '@uniswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import contractList from '../contractsLocal'
import contractsSepolia from '../contractsSepolia'
import { AIRLABEL_TOKEN_LIST_ARBITRUM, AIR_TOKEN_LIST_ARBITRUM, ALGLABEL_TOKEN_LIST_ARBITRUM, ST_TOKEN_LIST_ARBITRUM } from './arbitrum'

export const ST_TOKEN_LIST: TokenInfo[] = [
  ...ST_TOKEN_LIST_ARBITRUM,
  {
    "name": "Dai Stablecoin",
    "address": contractsSepolia.Daitoken,
    "symbol": "DAI",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": contractsSepolia.USDCtoken,
    "symbol": "USDC",
    "decimals": 6,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": contractsSepolia.USDTtoken,
    "symbol": "USDT",
    "decimals": 6,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Dai Stablecoin",
    "address": contractList.Daitoken,
    "symbol": "DAI",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": contractList.USDCtoken,
    "symbol": "USDC",
    "decimals": 6,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": contractList.USDTtoken,
    "symbol": "USDT",
    "decimals": 6,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  }
]

export const AIR_TOKEN_LIST: TokenInfo[] = [
  ...AIR_TOKEN_LIST_ARBITRUM,
  {
    "name": "Dai Stablecoin",
    "address": contractsSepolia.AirDaitoken,
    "symbol": "Air-DAI",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": contractsSepolia.AirUSDCtoken,
    "symbol": "Air-USDC",
    "decimals": 6,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": contractsSepolia.AirUSDTtoken,
    "symbol": "Air-USDT",
    "decimals": 6,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "ETH",
    "address": contractsSepolia.AirETHtoken,
    "symbol": "Air-ETH",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Dai Stablecoin",
    "address": contractList.AirDaitoken,
    "symbol": "Air-DAI",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": contractList.AirUSDCtoken,
    "symbol": "Air-USDC",
    "decimals": 6,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": contractList.AirUSDTtoken,
    "symbol": "Air-USDT",
    "decimals": 6,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "ETH",
    "address": contractList.AirETHtoken,
    "symbol": "Air-ETH",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  }
]

export const AIRLABEL_TOKEN_LIST: TokenInfo[] = [
  ...AIRLABEL_TOKEN_LIST_ARBITRUM,
  {
    "name": "Air-Social",
    "address": contractsSepolia['Air-Social'],
    "symbol": "Air-Social",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Sports",
    "address": contractsSepolia['Air-Sports'],
    "symbol": "Air-Sports",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Game",
    "address": contractsSepolia['Air-Game'],
    "symbol": "Air-Game",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Art",
    "address": contractsSepolia['Air-Art'],
    "symbol": "Air-Art",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Finance",
    "address": contractsSepolia['Air-Finance'],
    "symbol": "Air-Finance",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Commerce",
    "address": contractsSepolia['Air-Commerce'],
    "symbol": "Air-Commerce",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Social",
    "address": contractList['Air-Social'],
    "symbol": "Air-Social",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Sports",
    "address": contractList['Air-Sports'],
    "symbol": "Air-Sports",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Game",
    "address": contractList['Air-Game'],
    "symbol": "Air-Game",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Art",
    "address": contractList['Air-Art'],
    "symbol": "Air-Art",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Finance",
    "address": contractList['Air-Finance'],
    "symbol": "Air-Finance",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Commerce",
    "address": contractList['Air-Commerce'],
    "symbol": "Air-Commerce",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  }
]

export const ALGLABEL_TOKEN_LIST: TokenInfo[] = [
  ...ALGLABEL_TOKEN_LIST_ARBITRUM,
  {
    "name": "Alg-Social",
    "address": contractsSepolia['Alg-Social'],
    "symbol": "Alg-Social",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Sports",
    "address": contractsSepolia['Alg-Sports'],
    "symbol": "Alg-Sports",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Game",
    "address": contractsSepolia['Alg-Game'],
    "symbol": "Alg-Game",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Art",
    "address": contractsSepolia['Alg-Art'],
    "symbol": "Alg-Art",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Finance",
    "address": contractsSepolia['Alg-Finance'],
    "symbol": "Alg-Finance",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Commerce",
    "address": contractsSepolia['Alg-Commerce'],
    "symbol": "Alg-Commerce",
    "decimals": 18,
    "chainId": ChainId.SEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Social",
    "address": contractList['Alg-Social'],
    "symbol": "Alg-Social",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Sports",
    "address": contractList['Alg-Sports'],
    "symbol": "Alg-Sports",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Game",
    "address": contractList['Alg-Game'],
    "symbol": "Alg-Game",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Art",
    "address": contractList['Alg-Art'],
    "symbol": "Alg-Art",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Finance",
    "address": contractList['Alg-Finance'],
    "symbol": "Alg-Finance",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Commerce",
    "address": contractList['Alg-Commerce'],
    "symbol": "Alg-Commerce",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  }
]

export const GET_AIRUSDT_2_USDT = (chainId?: number) => {
  let pair: {[key: string]: string} = {}
  AIR_TOKEN_LIST.filter(token => token.chainId === chainId).map(token1 => {
    const symbol = token1.symbol.slice(4)
    if (symbol === 'ETH') {
      const key = (token1?.address || '') as string
      // @ts-ignore
      pair[key] = 'ETH'
    }
    const toUSDT = ST_TOKEN_LIST.filter(token => token.chainId === chainId).find(token2 => token2.symbol === symbol)
    if (token1.address && toUSDT) {
      const key = (token1?.address || '') as string
      // @ts-ignore
      pair[key] = toUSDT?.address
    }

  })

  return pair
} 

export const GET_ALGTOKEN_2_AIRTOKEN = (chainId?: number) => {
  let pair: {[key: string]: string} = {}
  ALGLABEL_TOKEN_LIST.filter(token => token.chainId === chainId).map(token1 => {
    const symbol = token1.symbol.slice(4)
    const toUSDT = AIRLABEL_TOKEN_LIST.filter(token => token.chainId === chainId).find(token2 => token2.symbol.slice(4) === symbol)
    if (token1.address) {
      const key = (token1?.address || '') as string
      // @ts-ignore
      pair[key] = toUSDT?.address
    }

  })

  return pair
} 

export const GET_AIRTOKEN_2_ALGTOKEN = (chainId?: number) => {
  let pair: {[key: string]: string} = {}
  AIRLABEL_TOKEN_LIST.filter(token => token.chainId === chainId).map(token1 => {
    const symbol = token1.symbol.slice(4)
    const toUSDT = ALGLABEL_TOKEN_LIST.filter(token => token.chainId === chainId).find(token2 => token2.symbol.slice(4) === symbol)
    if (token1.address) {
      const key = (token1?.address || '') as string
      // @ts-ignore
      pair[key] = toUSDT?.address
    }

  })

  return pair
} 

