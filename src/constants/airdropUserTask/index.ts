import { ChainId } from '@uniswap/sdk'
import AirdropUserTask_ABI from './abi.json'
import contractList from '../contractsLocal'

const AirdropUserTask_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.SEPOLIA]: '0xDeE1C5a0f971E3b10e896793Ff27251434c5062C',
  [ChainId.LOCAL]: contractList.airdropUserTask,
}

export { AirdropUserTask_ABI, AirdropUserTask_NETWORKS }


