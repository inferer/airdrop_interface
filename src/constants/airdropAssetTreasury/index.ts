import { ChainId } from '@uniswap/sdk'
import AirdropAssetTreasury_ABI from './abi.json'

const AirdropAssetTreasury_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  // [ChainId.SEPOLIA]: '0x59E56cDc025083c8D2cd6E01FAD0c56174c735E9',
  [ChainId.SEPOLIA]: '0x09f53e8196fB855678C9A46B445f7a9e6f43CEEf',
}

export { AirdropAssetTreasury_ABI, AirdropAssetTreasury_NETWORKS }
