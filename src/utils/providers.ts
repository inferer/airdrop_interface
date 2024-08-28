import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@uniswap/sdk'

const rpcUrl = 'https://public.stackup.sh/api/v1/node/arbitrum-sepolia'
export const bscRpcProvider = new StaticJsonRpcProvider(rpcUrl)

export const getRpcProider = (chaidId: ChainId) => {
  return new StaticJsonRpcProvider()
} 

export default bscRpcProvider