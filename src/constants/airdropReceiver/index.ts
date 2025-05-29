import { ChainId } from '@uniswap/sdk'
import AirdropReceiver_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'
import contractsAirdrop from '../contractsAirdrop'
import contractsLensSepolia from '../contractsLensSepolia'

const AirdropReceiver_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropReceriver,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropReceriver,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropReceriver,
  [ChainId.LOCAL]: contractList.airdropReceriver,
  [ChainId.AIRDROP]: contractsAirdrop.airdropReceriver,
  [ChainId.LENSSEPOLIA]: contractsLensSepolia.airdropReceiver,
}

export { AirdropReceiver_ABI, AirdropReceiver_NETWORKS }
