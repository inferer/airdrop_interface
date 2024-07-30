import { ChainId } from '@uniswap/sdk'
import AirdropManager_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'

const AirdropManager_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropManager,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropManager,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropManager,
  [ChainId.LOCAL]: contractList.airdropManager,
  [ChainId.AIRDROP]: contractList.airdropManager,
}

export { AirdropManager_ABI, AirdropManager_NETWORKS }


