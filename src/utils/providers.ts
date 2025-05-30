import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@uniswap/sdk'

const rpcUrl = 'https://rpc.testnet.lens.dev'
export const bscRpcProvider = new StaticJsonRpcProvider(rpcUrl)

export const getRpcProider = (chaidId: ChainId) => {
  return new StaticJsonRpcProvider()
} 

export default bscRpcProvider