import { ChainId } from '@uniswap/sdk'
import PROJECTDEMO_ABI from './abi.json'
import contractList, { othersContracts } from '../contractsLocal'

const PROJECTDEMO_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.SEPOLIA]: '0xF275CCbAECB83a128284FC1f0744E1A9459fc2ED',
  [ChainId.LOCAL]: othersContracts.projectContract,
}

export { PROJECTDEMO_ABI, PROJECTDEMO_NETWORKS }

