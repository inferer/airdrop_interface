import { ChainId } from '@uniswap/sdk'
import AirdropTokenScore_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'

const AirdropTokenScore_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropTokenScore,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropTokenScore,
  [ChainId.LOCAL]: contractList.airdropTokenScore,
}

export { AirdropTokenScore_ABI, AirdropTokenScore_NETWORKS }
