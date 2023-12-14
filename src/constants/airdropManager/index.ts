import { ChainId } from '@uniswap/sdk'
import AirdropManager_ABI from './abi.json'

const AirdropManager_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  // [ChainId.SEPOLIA]: '0x7Ce460881844Cc76ac2bD665f367B65530fC0560',
  // [ChainId.SEPOLIA]: '0x837Cd348437004a91B721Bafa7CF9F8c65CB4411',
  [ChainId.SEPOLIA]: '0xeA7e608Dc26040751191Bd7F55FD33DA92BaAB82',
}

export { AirdropManager_ABI, AirdropManager_NETWORKS }


