import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'

import { network, setupNetwork } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks'
import { CHAIN_LIST, NetworkContextName } from '../../constants'
import Loader from '../Loader'
import { useUserInfo, useUserRoleMode } from '../../state/user/hooks'
import { useRouter } from 'next/router'

const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
`

const Message = styled.h2`
  color: ${({ theme }) => theme.secondary1};
`

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active, account, chainId, deactivate } = useWeb3React()
  const router = useRouter()
  const [ isProjectMode ] = useUserRoleMode()
  const { handleGetUserInfo } = useUserInfo()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName)

  useEffect(() => {
    if (account && router.pathname !== '/join') {
      handleGetUserInfo(account)
        .then((userInfo: any) => {
          if (userInfo && userInfo.id) {

          } else {
            deactivate()
            router.push('/join')
          }
        })
    }

    // if (!account && router.pathname !== '/join') {
    //   if (isProjectMode) {
    //     router.push('/project/swap')
    //   } else {
    //     router.push('/user/swap')
    //   }
    // }
  }, [account, isProjectMode])

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network)
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active])

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager)

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (router.query.chain && chainId) {
      const chainData = CHAIN_LIST.find(chain => chain.value === router.query.chain)
      if (chainId !== chainData?.chainId) {
        setupNetwork(chainData?.chainId)
      }
    }
  }, [router.query, chainId])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return (
      <MessageWrapper>
        <Message>{'unknownError'}</Message>
      </MessageWrapper>
    )
  }

  // if neither context is active, spin
  // if (!active && !networkActive) {
  //   return showLoader ? (
  //     <MessageWrapper>
  //       <Loader />
  //     </MessageWrapper>
  //   ) : null
  // }

  return children
}
