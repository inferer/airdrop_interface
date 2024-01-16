import { ChainId } from '@uniswap/sdk'
import { NETWORK_CHAIN_ID } from '../../connectors'
import { TokenInfo } from '@uniswap/token-lists'
import contractList from '../contractsLocal'

export const ST_TOKEN_LIST: TokenInfo[] = [
  {
    "name": "Dai Stablecoin",
    "address": "0x2C8dF20048860e0a88564D8c72EF38b2E5486B4D",
    "symbol": "DAI",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": "0x355781B18969F69401e759EEe848EA4696d44321",
    "symbol": "USDC",
    "decimals": 6,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": "0x521957098aC7a7AC7eAa3631d10E640310873c00",
    "symbol": "USDT",
    "decimals": 6,
    "chainId": 11155111,
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
  {
    "name": "Dai Stablecoin",
    "address": "0x8C0D0E71b485DffC9df277AC09a0AD8d7758792A",
    "symbol": "air-DAI",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": "0x787562367E63A10bdC1323F5AF9BE59e2ebA490F",
    "symbol": "air-USDC",
    "decimals": 6,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": "0x300f6B06211F490c2A5Fb5c7f634A3f6D636E355",
    "symbol": "air-USDT",
    "decimals": 6,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "ETH",
    "address": "0x05823a3ee699F9277134A111Ab801548524E6C6B",
    "symbol": "air-ETH",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Dai Stablecoin",
    "address": contractList.AirDaitoken,
    "symbol": "air-DAI",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": contractList.AirUSDCtoken,
    "symbol": "air-USDC",
    "decimals": 6,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": contractList.AirUSDTtoken,
    "symbol": "air-USDT",
    "decimals": 6,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "ETH",
    "address": contractList.AirETHtoken,
    "symbol": "air-ETH",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  }
]



export const AIRLABEL_TOKEN_LIST: TokenInfo[] = [
  {
    "name": "air-Social",
    "address": "0xc021C5268aeE94ebBd318Ea8DB4e0b50ccE4AD16",
    "symbol": "air-Social",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Sports",
    "address": "0x4b4E8A920e396FBb89Ff393ff9F5A767daAb9987",
    "symbol": "air-Sports",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Game",
    "address": "0xebc1A018185d3cD251F7c9D9C3D546ece1764AFD",
    "symbol": "air-Game",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Art",
    "address": "0x58C5b3582dbA2d16B8ba40e1b303EEeD73799faB",
    "symbol": "air-Art",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Finance",
    "address": "0x838B8AB3336c8d7944e0Ad47C501407c34910eD5",
    "symbol": "air-Finance",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Commerce",
    "address": "0x718f9ca36D58E7a922B5959C6DdD7455b3A9E3a4",
    "symbol": "air-Commerce",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Social",
    "address": contractList['air-Social'],
    "symbol": "air-Social",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Sports",
    "address": contractList['air-Sports'],
    "symbol": "air-Sports",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Game",
    "address": contractList['air-Game'],
    "symbol": "air-Game",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Art",
    "address": contractList['air-Art'],
    "symbol": "air-Art",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Finance",
    "address": contractList['air-Finance'],
    "symbol": "air-Finance",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Commerce",
    "address": contractList['air-Commerce'],
    "symbol": "air-Commerce",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  }
]

export const ALGLABEL_TOKEN_LIST: TokenInfo[] = [
  {
    "name": "alg-Social",
    "address": "0xdCbC46a80492A1db9533EBd4e3dCe7831B09F103",
    "symbol": "alg-Social",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Sports",
    "address": "0x201f8391F31143A7416AE8F4C7C31B85024c00Ba",
    "symbol": "alg-Sports",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Game",
    "address": "0x4cF48D72aAB636BD2De2e8a141677d5538502fF2",
    "symbol": "alg-Game",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Art",
    "address": "0xA08a40a8CeF6011885BA9BD65D446226f9E796Be",
    "symbol": "alg-Art",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Finance",
    "address": "0xb8366e5Bc44cd4DC1DE4FcC36774324FE1d3C680",
    "symbol": "alg-Finance",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Commerce",
    "address": "0xf88DDd9259B05bE8339Aea6aA94E90df7fE94881",
    "symbol": "alg-Commerce",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Social",
    "address": contractList['alg-Social'],
    "symbol": "alg-Social",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Sports",
    "address": contractList['alg-Sports'],
    "symbol": "alg-Sports",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Game",
    "address": contractList['alg-Game'],
    "symbol": "alg-Game",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Art",
    "address": contractList['alg-Art'],
    "symbol": "alg-Art",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Finance",
    "address": contractList['alg-Finance'],
    "symbol": "alg-Finance",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Commerce",
    "address": contractList['alg-Commerce'],
    "symbol": "alg-Commerce",
    "decimals": 18,
    "chainId": ChainId.LOCAL,
    "logoURI": "/images/tokens/usdt.png"
  }
]

export const GET_AIRUSDT_2_USDT = () => {
  let pair: {[key: string]: string} = {}
  AIR_TOKEN_LIST.filter(token => token.chainId === NETWORK_CHAIN_ID).map(token1 => {
    const symbol = token1.symbol.slice(4)
    if (symbol === 'ETH') {
      const key = (token1?.address || '') as string
      // @ts-ignore
      pair[key] = 'ETH'
    }
    const toUSDT = ST_TOKEN_LIST.filter(token => token.chainId === NETWORK_CHAIN_ID).find(token2 => token2.symbol === symbol)
    if (token1.address && toUSDT) {
      const key = (token1?.address || '') as string
      // @ts-ignore
      pair[key] = toUSDT?.address
    }

  })

  return pair
} 

export const GET_ALGTOKEN_2_AIRTOKEN = () => {
  let pair: {[key: string]: string} = {}
  ALGLABEL_TOKEN_LIST.filter(token => token.chainId === NETWORK_CHAIN_ID).map(token1 => {
    const symbol = token1.symbol.slice(4)
    const toUSDT = AIRLABEL_TOKEN_LIST.find(token2 => token2.symbol.slice(4) === symbol)
    if (token1.address) {
      const key = (token1?.address || '') as string
      // @ts-ignore
      pair[key] = toUSDT?.address
    }

  })

  return pair
} 

export const GET_AIRTOKEN_2_ALGTOKEN = () => {
  let pair: {[key: string]: string} = {}
  AIRLABEL_TOKEN_LIST.filter(token => token.chainId === NETWORK_CHAIN_ID).map(token1 => {
    const symbol = token1.symbol.slice(4)
    const toUSDT = ALGLABEL_TOKEN_LIST.filter(token => token.chainId === NETWORK_CHAIN_ID).find(token2 => token2.symbol.slice(4) === symbol)
    if (token1.address) {
      const key = (token1?.address || '') as string
      // @ts-ignore
      pair[key] = toUSDT?.address
    }

  })

  return pair
} 

