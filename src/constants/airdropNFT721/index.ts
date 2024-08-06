import { ChainId } from '@uniswap/sdk'
import AirdropNFT721_ABI from './abi.json'
import contractList, { airdropReferContracts } from '../contractsLocal'
import sepoliaContractList from '../contractsSepolia'
import contractsArbitrumList from '../contractsArbitrum'
import contractsBase from '../contractsBase'

const AirdropNFT721_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.BASE]: contractsBase.airdropSender,
  [ChainId.ARBITRUM]: contractsArbitrumList.airdropSender,
  [ChainId.SEPOLIA]: sepoliaContractList.airdropSender,
  [ChainId.LOCAL]: airdropReferContracts.airdropNFT721,
  [ChainId.AIRDROP]: contractList.airdropSender,
}

export { AirdropNFT721_ABI, AirdropNFT721_NETWORKS }
