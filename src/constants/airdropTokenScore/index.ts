import { ChainId } from '@uniswap/sdk'
import AirdropTokenScore_ABI from './abi.json'

const AirdropTokenScore_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  // [ChainId.SEPOLIA]: '0x8892959359e7566298928e663F71e98ECBA7beFb',
  [ChainId.SEPOLIA]: '0x87340F868D0e3BA5eDf9b06650b2B4eDFc581534',
}

export { AirdropTokenScore_ABI, AirdropTokenScore_NETWORKS }
