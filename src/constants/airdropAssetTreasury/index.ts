import { ChainId } from '@uniswap/sdk'
import AirdropAssetTreasury_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'

const AirdropAssetTreasury_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropAssetTreasury,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropAssetTreasury,
  [ChainId.LOCAL]: contractList.airdropAssetTreasury,
}

export { AirdropAssetTreasury_ABI, AirdropAssetTreasury_NETWORKS }
