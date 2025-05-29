import { ChainId } from '@uniswap/sdk'
import AirdropSender_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'
import contractsAirdrop from '../contractsAirdrop'
import contractsLensSepolia from '../contractsLensSepolia'

const AirdropSender_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropSender,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropSender,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropSender,
  [ChainId.LOCAL]: contractList.airdropSender,
  [ChainId.AIRDROP]: contractsAirdrop.airdropSender,
  [ChainId.LENSSEPOLIA]: contractsLensSepolia.airdropSenderRefer,
}

export { AirdropSender_ABI, AirdropSender_NETWORKS }
