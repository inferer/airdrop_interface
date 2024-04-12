import { ChainId } from '@uniswap/sdk'
import AirdropSender_ABI from './abi.json'
import contractList from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'

const AirdropSender_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.SEPOLIA]: sepoliaContractList.airdropSender,
  [ChainId.LOCAL]: contractList.airdropSender,
}

export { AirdropSender_ABI, AirdropSender_NETWORKS }
