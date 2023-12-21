import { ChainId } from '@uniswap/sdk'
import AirdropSender_ABI from './abi.json'

const AirdropSender_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  // [ChainId.SEPOLIA]: '0xd92E80085F0F38E8e9a4FB6E7e35D88f9E4B0aE1',
  // [ChainId.SEPOLIA]: '0x930DC1B788d2e7Ec1E6c8D25075feb8Ee5891f4C',
  // [ChainId.SEPOLIA]: '0x774ce0e31DB78ee30a45D6B3D607E4bc8087970b',
  [ChainId.SEPOLIA]: '0xEc4d014d8F7da90c4C68C372E3346d2A78E0Fc05',
}

export { AirdropSender_ABI, AirdropSender_NETWORKS }
