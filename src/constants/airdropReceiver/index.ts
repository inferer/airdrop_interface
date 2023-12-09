import { ChainId } from '@uniswap/sdk'
import AirdropReceiver_ABI from './abi.json'

const AirdropReceiver_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.SEPOLIA]: '0xE0c64653bD92E1cb13133D31D1096e48e6eC20D3',
}

export { AirdropReceiver_ABI, AirdropReceiver_NETWORKS }
