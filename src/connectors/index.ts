import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import { PortisConnector } from '@web3-react/portis-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import { ChainId } from '@uniswap/sdk'

// export const NETWORK_URL = process.env.NEXT_PUBLIC_NETWORK_URL
export const NETWORK_URL = 'https://public.stackup.sh/api/v1/node/arbitrum-sepolia'
const FORMATIC_KEY = process.env.NEXT_PUBLIC_FORTMATIC_KEY
const PORTIS_ID = process.env.NEXT_PUBLIC_PORTIS_ID

export const NETWORK_CHAIN_ID: number = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? '1')

console.log(NETWORK_CHAIN_ID)

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`NEXT_PUBLIC_NETWORK_URL must be a defined environment variable`)
}

export const APP_INFERER_CONNECTOR = 'APP_INFERER_CONNECTOR'

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 421614, 1337]
})

// mainnet only
// export const walletconnect = new WalletConnectConnector({
//   rpc: { 1: NETWORK_URL },
//   bridge: 'https://bridge.walletconnect.org',
//   qrcode: true,
//   pollingInterval: 15000
// })

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://testnet.bscscan.com',
  [ChainId.LOCAL]: 'https://bscscan.com'
}

export const BSC_RPC_URLS = [
  'https://bsc-dataseed1.ninicoin.io',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed.binance.org'
]

export const BSC_RPC_URLS_LOCAL = [
  'https://node.inferer.xyz',
]


const NETWORK_CONFIG: any = {
  [ChainId.MAINNET]: {
    name: 'BNB Smart Chain Mainnet',
    scanURL: BASE_BSC_SCAN_URLS[ChainId.MAINNET],
    rpcUrls: BSC_RPC_URLS
  },
  [ChainId.LOCAL]: {
    name: 'Airdrop Network',
    scanURL: BASE_BSC_SCAN_URLS[ChainId.LOCAL],
    rpcUrls: BSC_RPC_URLS_LOCAL
  },

}

export const setupNetwork = async (chainId?: number, externalProvider?: any) => {
  console.log('chainId', chainId)
  const provider = externalProvider || window.ethereum
  if (!chainId || !NETWORK_CONFIG[chainId]) {
    console.error('Invalid chain id')
    return false
  }
  if (provider && provider.request) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      })
      return true
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          const chainData = NETWORK_CONFIG[chainId]
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: NETWORK_CONFIG[chainId].name,
                nativeCurrency: {
                  name: chainData.symbol ? chainData.symbol : 'ETH',
                  symbol: chainData.symbol ? chainData.symbol : 'ETH',
                  decimals: 18
                },
                iconUrls: ['https://beta.inferer.xyz/images/logo.png'],
                rpcUrls: NETWORK_CONFIG[chainId].rpcUrls,
                blockExplorerUrls: [`${NETWORK_CONFIG[chainId].scanURL}/`]
              }
            ]
          })
          return true
        } catch (error) {
          console.error('Failed to setup the network in Metamask:', error)
          return false
        }
      }
      return false
    }
  } else {
    console.error("Can't setup the network on metamask because window.ethereum is undefined")
    return false
  }
}

