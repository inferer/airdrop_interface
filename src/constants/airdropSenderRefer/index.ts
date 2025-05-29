import { ChainId } from '@uniswap/sdk'
import AirdropSenderRefer_ABI from './abi.json'
import contractList, { airdropReferContracts } from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'
import contractsAirdrop from '../contractsAirdrop'
import contractsLensSepolia from '../contractsLensSepolia'

const AirdropSenderRefer_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropSender,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropSender,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropSender,
  [ChainId.LOCAL]: airdropReferContracts.airdropSenderRefer,
  [ChainId.AIRDROP]: contractsAirdrop.airdropSender,
  [ChainId.LENSSEPOLIA]: contractsLensSepolia.airdropSenderRefer,
}

export { AirdropSenderRefer_ABI, AirdropSenderRefer_NETWORKS }
