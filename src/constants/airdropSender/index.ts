import { ChainId } from '@uniswap/sdk'
import AirdropSender_ABI from './abi.json'

const AirdropSender_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.SEPOLIA]: '0xd92E80085F0F38E8e9a4FB6E7e35D88f9E4B0aE1',
  // [ChainId.SEPOLIA]: '0x61b133E16cC215F61d2E47f7D228F5EC3FB6C8B8',
}

export { AirdropSender_ABI, AirdropSender_NETWORKS }
