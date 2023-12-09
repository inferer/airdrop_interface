import { ChainId } from '@uniswap/sdk'
import AirdropAssetTreasury_ABI from './abi.json'

const AirdropAssetTreasury_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  // [ChainId.SEPOLIA]: '0xd92E80085F0F38E8e9a4FB6E7e35D88f9E4B0aE1',
  // [ChainId.SEPOLIA]: '0x930DC1B788d2e7Ec1E6c8D25075feb8Ee5891f4C',
  [ChainId.SEPOLIA]: '0x92B97ea7dE7BEc9C6F75F9a450979F33098fB32a',
}

export { AirdropAssetTreasury_ABI, AirdropAssetTreasury_NETWORKS }
