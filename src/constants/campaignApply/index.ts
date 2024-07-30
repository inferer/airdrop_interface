import { ChainId } from '@uniswap/sdk'
import CampaignApply_ABI from './abi.json'
import contractList, { campaignContracts } from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'

const CampaignApply_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropSender,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropSender,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropSender,
  [ChainId.LOCAL]: campaignContracts.campaignApply,
  [ChainId.AIRDROP]: campaignContracts.campaignApply,
}

export { CampaignApply_ABI, CampaignApply_NETWORKS }
