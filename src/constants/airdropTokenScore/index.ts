import { ChainId } from '@uniswap/sdk'
import AirdropTokenScore_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'

const AirdropTokenScore_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropTokenScore,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropTokenScore,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropTokenScore,
  [ChainId.LOCAL]: contractList.airdropTokenScore,
}

export { AirdropTokenScore_ABI, AirdropTokenScore_NETWORKS }
