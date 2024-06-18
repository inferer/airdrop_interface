import { ChainId } from '@uniswap/sdk'
import CampaignManager_ABI from './abi.json'
import contractList, { campaignContracts } from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'

const CampaignManager_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropSender,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropSender,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropSender,
  [ChainId.LOCAL]: campaignContracts.campaignManager,
}

export { CampaignManager_ABI, CampaignManager_NETWORKS }
