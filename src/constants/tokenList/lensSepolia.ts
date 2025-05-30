import { ChainId } from '@uniswap/sdk'
import { TokenInfo } from '@uniswap/token-lists'
import contractsLensSepolia, { campaignContracts } from '../contractsLensSepolia'

export const ST_TOKEN_LIST_LENSSEPOLIA: TokenInfo[] = [
  {
    "name": "Dai Stablecoin",
    "address": contractsLensSepolia.Daitoken,
    "symbol": "DAI",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": contractsLensSepolia.USDCtoken,
    "symbol": "USDC",
    "decimals": 6,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": contractsLensSepolia.USDTtoken,
    "symbol": "USDT",
    "decimals": 6,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },

]

export const AIR_TOKEN_LIST_LENSSEPOLIA: TokenInfo[] = [
  {
    "name": "Dai Stablecoin",
    "address": contractsLensSepolia.AirDaitoken,
    "symbol": "Air-DAI",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": contractsLensSepolia.AirUSDCtoken,
    "symbol": "Air-USDC",
    "decimals": 6,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": contractsLensSepolia.AirUSDTtoken,
    "symbol": "Air-USDT",
    "decimals": 6,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "ETH",
    "address": contractsLensSepolia.AirETHtoken,
    "symbol": "Air-ETH",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
]

export const AIRLABEL_TOKEN_LIST_LENSSEPOLIA: TokenInfo[] = [
  {
    "name": "Air-Social",
    "address": contractsLensSepolia['Air-Social'],
    "symbol": "Air-Social",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Sports",
    "address": contractsLensSepolia['Air-Sports'],
    "symbol": "Air-Sports",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Game",
    "address": contractsLensSepolia['Air-Game'],
    "symbol": "Air-Game",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Art",
    "address": contractsLensSepolia['Air-Art'],
    "symbol": "Air-Art",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Finance",
    "address": contractsLensSepolia['Air-Finance'],
    "symbol": "Air-Finance",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Commerce",
    "address": contractsLensSepolia['Air-Commerce'],
    "symbol": "Air-Commerce",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Campaign",
    "address": campaignContracts['Air-Campaign'],
    "symbol": "Air-Campaign",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
]

export const ALGLABEL_TOKEN_LIST_LENSSEPOLIA: TokenInfo[] = [
  {
    "name": "Alg-Social",
    "address": contractsLensSepolia['Alg-Social'],
    "symbol": "Alg-Social",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Sports",
    "address": contractsLensSepolia['Alg-Sports'],
    "symbol": "Alg-Sports",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Game",
    "address": contractsLensSepolia['Alg-Game'],
    "symbol": "Alg-Game",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Art",
    "address": contractsLensSepolia['Alg-Art'],
    "symbol": "Alg-Art",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Finance",
    "address": contractsLensSepolia['Alg-Finance'],
    "symbol": "Alg-Finance",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Commerce",
    "address": contractsLensSepolia['Alg-Commerce'],
    "symbol": "Alg-Commerce",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Campaign",
    "address": campaignContracts['Alg-Campaign'],
    "symbol": "Alg-Campaign",
    "decimals": 18,
    "chainId": ChainId.LENSSEPOLIA,
    "logoURI": "/images/tokens/usdt.png"
  },
]