import { ChainId } from '@uniswap/sdk'
import AirdropReceiver_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'

const AirdropReceiver_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropReceriver,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropReceriver,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropReceriver,
  [ChainId.LOCAL]: contractList.airdropReceriver,
  [ChainId.AIRDROP]: contractList.airdropReceriver,
}

export { AirdropReceiver_ABI, AirdropReceiver_NETWORKS }
