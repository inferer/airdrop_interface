import { ChainId } from '@uniswap/sdk'
import AirdropManager_ABI from './abi.json'

const AirdropManager_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  // [ChainId.SEPOLIA]: '0x7Ce460881844Cc76ac2bD665f367B65530fC0560',
  // [ChainId.SEPOLIA]: '0x837Cd348437004a91B721Bafa7CF9F8c65CB4411',
  // [ChainId.SEPOLIA]: '0xeA7e608Dc26040751191Bd7F55FD33DA92BaAB82',
  // [ChainId.SEPOLIA]: '0x59B79C2F408b207Cc178d19d2df5567c0E42801a',
  // [ChainId.SEPOLIA]: '0xF127f051d9E06a4Af12e7EB2741319ded8D803db',
  // [ChainId.SEPOLIA]: '0x392564B404De462C280a4169A910fE48D4f59B89',
  [ChainId.SEPOLIA]: '0xD141D14CFDD708D0a07b6322182FF0f043B15217',
}

export { AirdropManager_ABI, AirdropManager_NETWORKS }


