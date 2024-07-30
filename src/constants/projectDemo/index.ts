import { ChainId } from '@uniswap/sdk'
import PROJECTDEMO_ABI from './abi.json'
import contractList, { othersContracts } from '../contractsLocal'
import { othersContracts as seopliaOthersContracts } from '../contractsSepolia'
import { othersContracts as arbitrumOthersContracts } from '../contractsArbitrum'

const PROJECTDEMO_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.BASE]: arbitrumOthersContracts.projectContract,
  [ChainId.ARBITRUM]: arbitrumOthersContracts.projectContract,
  [ChainId.SEPOLIA]: seopliaOthersContracts.projectContract,
  [ChainId.LOCAL]: othersContracts.projectContract,
  [ChainId.AIRDROP]: othersContracts.projectContract,
}

export { PROJECTDEMO_ABI, PROJECTDEMO_NETWORKS }

