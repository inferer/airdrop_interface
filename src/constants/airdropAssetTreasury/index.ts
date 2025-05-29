import { ChainId } from '@uniswap/sdk'
import AirdropAssetTreasury_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'
import contractsAirdrop from '../contractsAirdrop'
import contractsLensSepolia from '../contractsLensSepolia'

const AirdropAssetTreasury_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropAssetTreasury,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropAssetTreasury,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropAssetTreasury,
  [ChainId.LOCAL]: contractList.airdropAssetTreasury,
  [ChainId.AIRDROP]: contractsAirdrop.airdropAssetTreasury,
  [ChainId.LENSSEPOLIA]: contractsLensSepolia.airdropAssetTreasury,
}

export { AirdropAssetTreasury_ABI, AirdropAssetTreasury_NETWORKS }
