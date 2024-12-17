import { ChainId } from '@uniswap/sdk'
import AirdropUserTask_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'
import contractsAirdrop from '../contractsAirdrop'

const AirdropUserTask_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropUserTask,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropUserTask,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropUserTask,
  [ChainId.LOCAL]: contractList.airdropUserTask,
  [ChainId.AIRDROP]: contractsAirdrop.airdropUserTask,
}

export { AirdropUserTask_ABI, AirdropUserTask_NETWORKS }


