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
    "name": "air-Activity",
    "address": "0x72a99424410249D5ba34A49445691D4f88cFb47E",
    "symbol": "air-Activity",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Social",
    "address": "0x3a1b55A11036B6B9056e6f53Cb76b22811f7d3Dd",
    "symbol": "air-Social",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Sport",
    "address": "0x55F6DF7a4BF225ACBbb9bD34cE6557CC085A77ed",
    "symbol": "air-Sport",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Game",
    "address": "0x8584fCdf6D511743beD39d12eD6F7BC9A1E3Fc17",
    "symbol": "air-Game",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Art",
    "address": "0x77258b21Ce41212C36FD60524DC4BB570cf36426",
    "symbol": "air-Art",
    "decimals": 18,
    "chainId": 11155111,
    "logoURI": "/images/tokens/usdt.png"
  },
  {
    "name": "air-Finance",
    "address": "0x271Ed95915DDFE288e615580BFfE05A54E5cc325",
    "symbol": "air-Finance",
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