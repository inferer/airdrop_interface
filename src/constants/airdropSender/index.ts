import { ChainId } from '@uniswap/sdk'
import AirdropSender_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'

const AirdropSender_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropSender,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropSender,
  [ChainId.LOCAL]: contractList.airdropSender,
}

export { AirdropSender_ABI, AirdropSender_NETWORKS }
