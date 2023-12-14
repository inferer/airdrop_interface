import { TokenInfo } from '@uniswap/token-lists'

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
  }
]



export const AIRLABEL_TOKEN_LIST: TokenInfo[] = [
  {
    "name": "air-Social",
    "address": "0xC831dF46B509428894D55fa7a6aA04Ca6727355E",
    "symbol": "air-Social",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Sport",
    "address": "0xEbda34FBfFe3e2115c859e9fbfc3FCeC7552dE65",
    "symbol": "air-Sport",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Game",
    "address": "0xF2c0A16dee9fE894E9A28bF8A7bE2Fe487458Bf2",
    "symbol": "air-Game",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Art",
    "address": "0xC2C75CF11A1885f58f5d79Df25D8Fa91fD67e051",
    "symbol": "air-Art",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Finance",
    "address": "0xDf1cD4DF0553442df4Fc589d14b75B49c864c21f",
    "symbol": "air-Finance",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  }
]

export const ALGLABEL_TOKEN_LIST: TokenInfo[] = [
  {
    "name": "alg-Social",
    "address": "0x7c24f3587be3a7b09b75236203b0E91C89AD6E74",
    "symbol": "alg-Social",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Sport",
    "address": "0xC266112f0c57CF5e7281402Cf9170713Db92b61E",
    "symbol": "alg-Sport",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Game",
    "address": "0xf2ED4E48527a347d5da819F02Db3FfA223412aB2",
    "symbol": "alg-Game",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Art",
    "address": "0xfC991A79f8B365ACD908a735Df3b126E3f93De88",
    "symbol": "alg-Art",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "alg-Finance",
    "address": "0x5119AEB6bD65E000a53f373Eb5C84FaaeBc782c3",
    "symbol": "alg-Finance",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  }
]

export const GET_AIRUSDT_2_USDT = () => {
  let pair: {[key: string]: string} = {}
  AIR_TOKEN_LIST.map(token1 => {
    const symbol = token1.symbol.slice(4)
    const toUSDT = ST_TOKEN_LIST.find(token2 => token2.symbol === symbol)
    if (token1.address) {
      const key = (token1?.address || '') as string
      // @ts-ignore
      pair[key] = toUSDT?.address
    }

  })

  return pair
} 

export const GET_ALGTOKEN_2_AIRTOKEN = () => {
  let pair: {[key: string]: string} = {}
  ALGLABEL_TOKEN_LIST.map(token1 => {
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