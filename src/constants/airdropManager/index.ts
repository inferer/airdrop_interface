import { ChainId } from '@uniswap/sdk'
import AirdropManager_ABI from './abi.json'
import contractList from '../contractsLocal'

const AirdropManager_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.SEPOLIA]: '0xDeE1C5a0f971E3b10e896793Ff27251434c5062C',
  [ChainId.LOCAL]: contractList.airdropManager,
}

export { AirdropManager_ABI, AirdropManager_NETWORKS }


