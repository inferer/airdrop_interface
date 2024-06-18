import { ChainId } from '@uniswap/sdk'
import MULTICALL_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.BASE]: contractsBase.multicall,
  [ChainId.ARBITRUM]: contractsArbitrumList.multicall,
  [ChainId.SEPOLIA]: sepoliaContractList.multicall,
  [ChainId.LOCAL]: contractList.multicall,
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }

