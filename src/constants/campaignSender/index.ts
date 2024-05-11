import { ChainId } from '@uniswap/sdk'
import CampaignSender_ABI from './abi.json'
import contractList, { campaignContracts } from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'

const CampaignSender_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropSender,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropSender,
  [ChainId.LOCAL]: campaignContracts.campaignManager,
}

export { CampaignSender_ABI, CampaignSender_NETWORKS }
