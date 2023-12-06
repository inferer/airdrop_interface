import { ChainId } from '@uniswap/sdk'
import AirdropManager_ABI from './abi.json'
import { NETWORK_CHAIN_ID } from '../../connectors'
import multicall from '../multicall'
import { Contract } from 'ethers'

const AirdropManager_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.SEPOLIA]: '0x7Ce460881844Cc76ac2bD665f367B65530fC0560',
}

export { AirdropManager_ABI, AirdropManager_NETWORKS }


