import { ChainId, JSBI, Percent, Token, WETH } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { fortmatic, injected } from '../connectors'
import { ethers } from 'ethers'
import contractList from './contractsLocal'
import contractsSepolia from './contractsSepolia'
import contractsArbitrum from './contractsArbitrum'
import contractsBase from './contractsBase'

export const OWER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  [ChainId.BASE]: '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea',
  [ChainId.ARBITRUM]: '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea',
  [ChainId.SEPOLIA]: '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea',
  [ChainId.LOCAL]: '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea',
  [ChainId.AIRDROP]: '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea'
}

export const ROUTER_ADDRESS = contractsSepolia.router02

export const ROUTER_ADDRESS2: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: contractsSepolia.router02,
  [ChainId.BASE]: contractsBase.router02,
  [ChainId.ARBITRUM]: contractsArbitrum.router02,
  [ChainId.SEPOLIA]: contractsSepolia.router02,
  [ChainId.LOCAL]: contractList.router02,
  [ChainId.AIRDROP]: contractList.router02
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')

export const DAI_SEPOLIA = new Token(ChainId.SEPOLIA, '0x2C8dF20048860e0a88564D8c72EF38b2E5486B4D', 18, 'DAI', 'Dai Stablecoin')
export const USDC_SEPOLIA = new Token(ChainId.SEPOLIA, '0x355781B18969F69401e759EEe848EA4696d44321', 6, 'USDC', 'USD//C')
export const USDT_SEPOLIA = new Token(ChainId.SEPOLIA, '0x521957098aC7a7AC7eAa3631d10E640310873c00', 6, 'USDT', 'Tether USD')

export const Air_Social_LOCAL = new Token(ChainId.LOCAL, contractList['Air-Social'], 18, 'Air-Social', 'Air-Social')
export const Air_Sports_LOCAL = new Token(ChainId.LOCAL, contractList['Air-Sports'], 18, 'Air-Sports', 'Air-Sports')
export const Air_Game_LOCAL = new Token(ChainId.LOCAL, contractList['Air-Game'], 18, 'Air-Game', 'Air-Game')
export const Air_Art_LOCAL = new Token(ChainId.LOCAL, contractList['Air-Art'], 18, 'Air-Art', 'Air-Art')
export const Air_Finance_LOCAL = new Token(ChainId.LOCAL, contractList['Air-Finance'], 18, 'Air-Finance', 'Air-Finance')
export const Air_Commerce_LOCAL = new Token(ChainId.LOCAL, contractList['Air-Commerce'], 18, 'Air-Commerce', 'Air-Commerce')

export const Air_Social_SEPOLIA = new Token(ChainId.SEPOLIA, contractsSepolia['Air-Social'], 18, 'Air-Social', 'Air-Social')
export const Air_Sports_SEPOLIA = new Token(ChainId.SEPOLIA, contractsSepolia['Air-Sports'], 18, 'Air-Sports', 'Air-Sports')
export const Air_Game_SEPOLIA= new Token(ChainId.SEPOLIA, contractsSepolia['Air-Game'], 18, 'Air-Game', 'Air-Game')
export const Air_Art_SEPOLIA = new Token(ChainId.SEPOLIA, contractsSepolia['Air-Art'], 18, 'Air-Art', 'Air-Art')
export const Air_Finance_SEPOLIA = new Token(ChainId.SEPOLIA, contractsSepolia['Air-Finance'], 18, 'Air-Finance', 'Air-Finance')
export const Air_Commerce_SEPOLIA = new Token(ChainId.SEPOLIA, contractsSepolia['Air-Commerce'], 18, 'Air-Commerce', 'Air-Commerce')

export const Air_Social_ARBITRUM = new Token(ChainId.ARBITRUM , contractsArbitrum['Air-Social'], 18, 'Air-Social', 'Air-Social')
export const Air_Sports_ARBITRUM  = new Token(ChainId.ARBITRUM , contractsArbitrum['Air-Sports'], 18, 'Air-Sports', 'Air-Sports')
export const Air_Game_ARBITRUM = new Token(ChainId.ARBITRUM , contractsArbitrum['Air-Game'], 18, 'Air-Game', 'Air-Game')
export const Air_Art_ARBITRUM  = new Token(ChainId.ARBITRUM , contractsArbitrum['Air-Art'], 18, 'Air-Art', 'Air-Art')
export const Air_Finance_ARBITRUM  = new Token(ChainId.ARBITRUM , contractsArbitrum['Air-Finance'], 18, 'Air-Finance', 'Air-Finance')
export const Air_Commerce_ARBITRUM  = new Token(ChainId.ARBITRUM , contractsArbitrum['Air-Commerce'], 18, 'Air-Commerce', 'Air-Commerce')

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.SEPOLIA]: [WETH[ChainId.SEPOLIA]],
  [ChainId.ARBITRUM]: [WETH[ChainId.ARBITRUM]],
  [ChainId.BASE]: [WETH[ChainId.BASE]],
  [ChainId.LOCAL]: [WETH[ChainId.LOCAL]],
  [ChainId.AIRDROP]: [WETH[ChainId.AIRDROP]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR],
  [ChainId.SEPOLIA]: [...WETH_ONLY[ChainId.SEPOLIA], DAI_SEPOLIA, USDC_SEPOLIA, USDT_SEPOLIA],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT],
  [ChainId.SEPOLIA]: [...WETH_ONLY[ChainId.SEPOLIA], DAI_SEPOLIA, USDC_SEPOLIA, USDT_SEPOLIA],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT],
  [ChainId.ARBITRUM]: [Air_Social_ARBITRUM, Air_Sports_ARBITRUM, Air_Game_ARBITRUM, Air_Art_ARBITRUM, Air_Finance_ARBITRUM, Air_Commerce_ARBITRUM],
  [ChainId.SEPOLIA]: [Air_Social_SEPOLIA, Air_Sports_SEPOLIA, Air_Game_SEPOLIA, Air_Art_SEPOLIA, Air_Finance_SEPOLIA, Air_Commerce_SEPOLIA],
  [ChainId.LOCAL]: [Air_Social_LOCAL, Air_Sports_LOCAL, Air_Game_LOCAL, Air_Art_LOCAL, Air_Finance_LOCAL, Air_Commerce_LOCAL]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC, USDT],
    [DAI, USDT]
  ],
  [ChainId.SEPOLIA]: [
    [USDC_SEPOLIA, USDT_SEPOLIA],
    [DAI_SEPOLIA, USDT_SEPOLIA]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  // WALLET_CONNECT: {
  //   connector: walletconnect,
  //   name: 'WalletConnect',
  //   iconName: 'walletConnectIcon.svg',
  //   description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
  //   href: null,
  //   color: '#4196FC',
  //   mobile: true
  // },
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5'
  // },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true
  // }
}

export const NetworkContextName = 'INFERER_NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))

export const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT

export const USER_POOL_SERVICE_ROOT = process.env.NEXT_PUBLIC_USER_POOL_SERVICE_ROOT

export enum UserRoleMode {
  PROJECT,
  USER
}

export enum UserAction {
  PROJECT_SWAP,
  CREATE,
  USER_SWAP,
  USER_COLLECT,
  PROJECT_CAMPAIGN,
  USER_CAMPAIGN
}

export const CHANNEL_LIST = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'contract', label: 'Contract' },
]

export const CHAIN_LIST = [
  { value: 'Airdrop', label: 'Airdrop', icon: '/images/airdrop/chain_airdrop.svg', chainId: ChainId.LOCAL },
  { value: 'Arbitrum', label: 'Arbitrum', icon: '/images/channel/arb.svg', chainId: ChainId.ARBITRUM },
  { value: 'Base', label: 'Base', icon: '/images/channel/arb.svg', chainId: ChainId.BASE },
]

export const TWITTER_ACTION = [
  { value: 'like', label: 'like' },
  { value: 'follow', label: 'follow' },
  { value: 'comment', label: 'comment' },
]

export const CONTRACT_ACTION = [
  { value: 'function', label: 'function' },
]

export const AIRDROP_DURATION = [
  { value: '1', label: '1day' },
  { value: '2', label: '2day' },
  { value: '3', label: '3day' },
  { value: '5', label: '5day' },
  { value: '7', label: '7day' },
]

export const CAMPAIGN_DURATION = [
  { value: '1', label: '1day' },
  { value: '7', label: '7day' },
  { value: '14', label: '14day' },
  { value: '30', label: '30day' },
  { value: '60', label: '60day' },
  { value: '90', label: '90day' },
]

export const AIRDROPREFER_TYPE = [
  { value: 'Commodity', label: 'Commodity' },
]

export const TWITTER_UNIT: {[key: string]: string} = {
  like: '1',
  follow: '2',
  comment: '3',
  function: '2'
}

export const AddressZero_ETH = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, ethers.constants.AddressZero, 18, 'ETH', 'ETH'),
  [ChainId.BASE]: new Token(ChainId.BASE, ethers.constants.AddressZero, 18, 'ETH', 'ETH'),
  [ChainId.ARBITRUM]: new Token(ChainId.ARBITRUM, ethers.constants.AddressZero, 18, 'ETH', 'ETH'),
  [ChainId.SEPOLIA]: new Token(ChainId.SEPOLIA, ethers.constants.AddressZero, 18, 'ETH', 'ETH'),
  [ChainId.LOCAL]: new Token(ChainId.MAINNET, ethers.constants.AddressZero, 18, 'ETH', 'ETH'),
  [ChainId.AIRDROP]: new Token(ChainId.AIRDROP, ethers.constants.AddressZero, 18, 'ETH', 'ETH'),
}

export const TEL_URL = 'https://t.me/+zTwxF2bS6a85NzI1'

export const INFERER_AIRDROP_SOURCE = 'INFERER_AIRDROP_SOURCE'

export const IRY_GATEWAY = 'https://gateway.irys.xyz'
