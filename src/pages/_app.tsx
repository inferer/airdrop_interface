import '../styles/globals.css'
import '../styles/search.scss'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import PageRoot from '../views/PageRoot'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ff007a" />
        <link rel="icon" href="/images/logo.png" />
        <link rel="stylesheet" href="/fonts/font.css" />
        <title>Inferer Airdrop</title>
        
      </Head>
      <PageRoot>
        <Component {...pageProps} />
      </PageRoot>
    </>
    
  )
  
}
