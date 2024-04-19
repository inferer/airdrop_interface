import { ChainId } from '@uniswap/sdk'
import AirdropReceiver_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'

const AirdropReceiver_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropReceriver,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropReceriver,
  [ChainId.LOCAL]: contractList.airdropReceriver,
}

export { AirdropReceiver_ABI, AirdropReceiver_NETWORKS }
