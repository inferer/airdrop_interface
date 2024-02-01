import React, { Suspense, useEffect } from 'react'

import styled from 'styled-components'
import Header from '../components/Header'
import Popups, { PopupsNew } from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { useRouter } from 'next/router'
import { useUserRoleMode } from '../state/user/hooks'
import RightMenu from '../components/RightMenu'


const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  height: 100vh;
  padding-top: 84px;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 16px;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

export default function App({ children }: any) {

  const router = useRouter()
  const [isProjectMode, toggleSetUserRoleMode] = useUserRoleMode()
  
  // useEffect(() => {
  //   if (
  //     router.pathname === '/swap' ||
  //     router.pathname === '/create'
  //   ) {
  //     if (!isProjectMode) {
  //       toggleSetUserRoleMode()
  //     }
  //   } else {
  //     if (isProjectMode) {
  //       toggleSetUserRoleMode()
  //     }
  //   }
  // }, [router, isProjectMode, toggleSetUserRoleMode])

  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <BodyWrapper>
        <Popups />
        <PopupsNew />
        <Web3ReactManager>
          { children}
        </Web3ReactManager>
      </BodyWrapper>
      <RightMenu />
    </AppWrapper>
  )
}
