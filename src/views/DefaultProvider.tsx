import { createWeb3ReactRoot } from '@web3-react/core'
import { NetworkContextName } from '../constants'


const Web3ReactProviderDefault = createWeb3ReactRoot(NetworkContextName)

const Web3ReactProviderDefaultSSR = ({ children, getLibrary }: any) => {
  return (
    <Web3ReactProviderDefault getLibrary={getLibrary}>
      {children}
    </Web3ReactProviderDefault>
  )
}

export default Web3ReactProviderDefaultSSR;