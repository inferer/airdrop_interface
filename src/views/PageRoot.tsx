import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import React, { useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import ReactGA from 'react-ga'
import { Provider } from 'react-redux'
// import './i18n'
import App from './App'
import store from '../state'
import ApplicationUpdater from '../state/application/updater'
import ListsUpdater from '../state/lists/updater'
import MulticallUpdater from '../state/multicall/updater'
import TransactionUpdater from '../state/transactions/updater'
import UserUpdater from '../state/user/updater'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from '../theme'
import getLibrary from '../utils/getLibrary'
import dynamic from 'next/dynamic'


const Web3ReactProviderDefault = dynamic(
  () => import('./DefaultProvider'),
  { ssr: false }
)

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

const PageRoot = ({ children }: any) => {
  useEffect(() => {
    if ('ethereum' in window) {
      ;(window.ethereum as any).autoRefreshOnNetworkChange = false
    }

    const GOOGLE_ANALYTICS_ID: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
    if (typeof GOOGLE_ANALYTICS_ID === 'string') {
      ReactGA.initialize(GOOGLE_ANALYTICS_ID)
      ReactGA.set({
        customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
      })
    } else {
      ReactGA.initialize('test', { testMode: true, debug: true })
    }

    window.addEventListener('error', error => {
      ReactGA.exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true
      })
    })
  }, [])
  return (
    <>
      <FixedGlobalStyle />
      <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactProviderDefault getLibrary={getLibrary}>
          <Provider store={store}>
            <Updaters />
            <ThemeProvider>
              <ThemedGlobalStyle />
              <App>{children}</App>
            </ThemeProvider>

          </Provider>
        </Web3ReactProviderDefault>
        
      </Web3ReactProvider>
    </>
  )
}

export default PageRoot


