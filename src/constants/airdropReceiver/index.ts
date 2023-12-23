import { ChainId } from '@uniswap/sdk'
import AirdropReceiver_ABI from './abi.json'

const AirdropReceiver_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  // [ChainId.SEPOLIA]: '0xE0c64653bD92E1cb13133D31D1096e48e6eC20D3',
  // [ChainId.SEPOLIA]: '0xd0548055e8D30DF9fCA38Da9ad7B7321E39a6204',
  // [ChainId.SEPOLIA]: '0xfEa3a5883Ddb03F3882B9e998a7E0bF7053C89D9',
  // [ChainId.SEPOLIA]: '0x54F08837A4f311e56A6deF9ca412D6066FD94917',
  // [ChainId.SEPOLIA]: '0x31C79B75Aa4B70F781Ba09fCB281413Dec3507d3',
  [ChainId.SEPOLIA]: '0x41a71177cF9a9a61C28c2A47319b377e2612c153',
}

export { AirdropReceiver_ABI, AirdropReceiver_NETWORKS }
