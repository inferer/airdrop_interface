import { Interface } from '@ethersproject/abi'
import ERC20_ABI from './erc20.json'
import ERC20_BYTES32_ABI from './erc20_bytes32.json'
import InfererAirUSDT_ABI from './InfererAirUSDT.json'

const ERC20_INTERFACE = new Interface(ERC20_ABI)
const InfererAirUSDT_INTERFACE = new Interface(InfererAirUSDT_ABI)

const ERC20_BYTES32_INTERFACE = new Interface(ERC20_BYTES32_ABI)

export default ERC20_INTERFACE
export { ERC20_ABI, ERC20_BYTES32_INTERFACE, ERC20_BYTES32_ABI, InfererAirUSDT_ABI, InfererAirUSDT_INTERFACE }
