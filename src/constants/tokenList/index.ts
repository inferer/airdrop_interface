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
    "symbol": "Air-DAI",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/dai.png"
  },
  {
    "name": "USD//C",
    "address": "0x787562367E63A10bdC1323F5AF9BE59e2ebA490F",
    "symbol": "Air-USDC",
    "decimals": 6,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdc.png"
  },
  {
    "name": "Tether USD",
    "address": "0x300f6B06211F490c2A5Fb5c7f634A3f6D636E355",
    "symbol": "Air-USDT",
    "decimals": 6,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "ETH",
    "address": "0x05823a3ee699F9277134A111Ab801548524E6C6B",
    "symbol": "Air-ETH",
    "decimals": 18,
    "chainId": 11155111,
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
  {
    "name": "Air-Social",
    "address": "0xc021C5268aeE94ebBd318Ea8DB4e0b50ccE4AD16",
    "symbol": "Air-Social",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Sports",
    "address": "0x4b4E8A920e396FBb89Ff393ff9F5A767daAb9987",
    "symbol": "Air-Sports",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Game",
    "address": "0xebc1A018185d3cD251F7c9D9C3D546ece1764AFD",
    "symbol": "Air-Game",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Art",
    "address": "0x58C5b3582dbA2d16B8ba40e1b303EEeD73799faB",
    "symbol": "Air-Art",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Finance",
    "address": "0x838B8AB3336c8d7944e0Ad47C501407c34910eD5",
    "symbol": "Air-Finance",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Air-Commerce",
    "address": "0x718f9ca36D58E7a922B5959C6DdD7455b3A9E3a4",
    "symbol": "Air-Commerce",
    "decimals": 18,
    "chainId": 11155111,
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
  {
    "name": "Alg-Social",
    "address": "0xdCbC46a80492A1db9533EBd4e3dCe7831B09F103",
    "symbol": "Alg-Social",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Sports",
    "address": "0x201f8391F31143A7416AE8F4C7C31B85024c00Ba",
    "symbol": "Alg-Sports",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Game",
    "address": "0x4cF48D72aAB636BD2De2e8a141677d5538502fF2",
    "symbol": "Alg-Game",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Art",
    "address": "0xA08a40a8CeF6011885BA9BD65D446226f9E796Be",
    "symbol": "Alg-Art",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Finance",
    "address": "0xb8366e5Bc44cd4DC1DE4FcC36774324FE1d3C680",
    "symbol": "Alg-Finance",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "Alg-Commerce",
    "address": "0xf88DDd9259B05bE8339Aea6aA94E90df7fE94881",
    "symbol": "Alg-Commerce",
    "decimals": 18,
    "chainId": 11155111,
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
    const toUSDT = AIRLABEL_TOKEN_LIST.filter(token => token.chainId === NETWORK_CHAIN_ID).find(token2 => token2.symbol.slice(4) === symbol)
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

