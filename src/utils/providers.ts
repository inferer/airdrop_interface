import { StaticJsonRpcProvider } from '@ethersproject/providers'

const rpcUrl = 'https://public.stackup.sh/api/v1/node/arbitrum-sepolia'
export const bscRpcProvider = new StaticJsonRpcProvider(rpcUrl)


export default bscRpcProvider