import { ChainId } from '@uniswap/sdk'
import AirdropUserPool_ABI from './abi.json'
import contractList from '../contractsLocal'

const AirdropUserPool_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  // [ChainId.SEPOLIA]: '0x8892959359e7566298928e663F71e98ECBA7beFb',
  // [ChainId.SEPOLIA]: '0x87340F868D0e3BA5eDf9b06650b2B4eDFc581534',
  [ChainId.SEPOLIA]: '0xa52853b775EB9857710508B1760f6dAbf73E5dE5',
  [ChainId.LOCAL]: contractList.airdropUserPool,
}

export { AirdropUserPool_ABI, AirdropUserPool_NETWORKS }
