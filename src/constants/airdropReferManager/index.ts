import { ChainId } from '@uniswap/sdk'
import AirdropReferManager_ABI from './abi.json'
import contractList, { airdropReferContracts } from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'
import contractsAirdrop from '../contractsAirdrop'

const AirdropReferManager_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropSender,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropSender,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropSender,
  [ChainId.LOCAL]: airdropReferContracts.referManager,
  [ChainId.AIRDROP]: contractsAirdrop.airdropSender,
}

export { AirdropReferManager_ABI, AirdropReferManager_NETWORKS }
