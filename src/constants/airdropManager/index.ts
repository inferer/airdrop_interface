import { ChainId } from '@uniswap/sdk'
import AirdropManager_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'

const AirdropManager_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.SEPOLIA]: sepoliaContractList.airdropManager,
  [ChainId.LOCAL]: contractList.airdropManager,
}

export { AirdropManager_ABI, AirdropManager_NETWORKS }


