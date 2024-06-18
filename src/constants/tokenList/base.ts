import { ChainId } from '@uniswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import contractsBase from '../contractsBase'

export const ST_TOKEN_LIST_BASE: TokenInfo[] = [
  {
    "name": "Dai Stablecoin",
    "address": contractsBase.Daitoken,
    "symbol": "DAI",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": contractsBase.USDCtoken,
    "symbol": "USDC",
    "decimals": 6,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": contractsBase.USDTtoken,
    "symbol": "USDT",
    "decimals": 6,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },

]

export const AIR_TOKEN_LIST_BASE: TokenInfo[] = [
  {
    "name": "Dai Stablecoin",
    "address": contractsBase.AirDaitoken,
    "symbol": "Air-DAI",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": contractsBase.AirUSDCtoken,
    "symbol": "Air-USDC",
    "decimals": 6,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": contractsBase.AirUSDTtoken,
    "symbol": "Air-USDT",
    "decimals": 6,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "ETH",
    "address": contractsBase.AirETHtoken,
    "symbol": "Air-ETH",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
]

export const AIRLABEL_TOKEN_LIST_BASE: TokenInfo[] = [
  {
    "name": "Air-Social",
    "address": contractsBase['Air-Social'],
    "symbol": "Air-Social",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Sports",
    "address": contractsBase['Air-Sports'],
    "symbol": "Air-Sports",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Game",
    "address": contractsBase['Air-Game'],
    "symbol": "Air-Game",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Art",
    "address": contractsBase['Air-Art'],
    "symbol": "Air-Art",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Finance",
    "address": contractsBase['Air-Finance'],
    "symbol": "Air-Finance",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Commerce",
    "address": contractsBase['Air-Commerce'],
    "symbol": "Air-Commerce",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
]

export const ALGLABEL_TOKEN_LIST_BASE: TokenInfo[] = [
  {
    "name": "Alg-Social",
    "address": contractsBase['Alg-Social'],
    "symbol": "Alg-Social",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Sports",
    "address": contractsBase['Alg-Sports'],
    "symbol": "Alg-Sports",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Game",
    "address": contractsBase['Alg-Game'],
    "symbol": "Alg-Game",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Art",
    "address": contractsBase['Alg-Art'],
    "symbol": "Alg-Art",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Finance",
    "address": contractsBase['Alg-Finance'],
    "symbol": "Alg-Finance",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Commerce",
    "address": contractsBase['Alg-Commerce'],
    "symbol": "Alg-Commerce",
    "decimals": 18,
    "chainId": ChainId.BASE,
    "logoURI": "/images/tokens/usdt.png"
  },
]