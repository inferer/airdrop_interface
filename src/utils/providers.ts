import { NETWORK_URL } from '../connectors'
import { StaticJsonRpcProvider } from '@ethersproject/providers'


export const bscRpcProvider = new StaticJsonRpcProvider(NETWORK_URL)


export default bscRpcProvider