import { ChainId } from '@uniswap/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager, useUserRoleMode } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { LightCard, YellowCard, BlueCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'

import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import VersionSwitch from './VersionSwitch'
import Link from 'next/link'
import LazyImage, { LazyImage2, LazyImage3 } from '../LazyImage'
import { AirdropTokensTabs } from '../NavigationTabs'

import router from 'next/router'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  padding-left: 7.8125vw;
  padding-right: 7.8125vw;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};

  @media screen and (max-width: 1440px){
    padding-left: 2.8125vw;
    padding-right: 2.8125vw;
  }
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};

  .icon-add {
    margin-right: 40px;
    cursor: pointer;
  }
  .icon-role {
    margin-right: 12px;
    cursor: pointer;
  }
  .icon-qiehuan {
    margin-left: 24px;
    cursor: pointer;
  }
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
  .more {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const AirdropCard = styled(BlueCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
  cursor: pointer;
`

const UniIcon = styled.div`
  img {
    width: 32px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img { 
      width: 32px;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.SEPOLIA]: 'Sepolia',
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const [ isProjectMode, toggleSetUserRoleMode] = useUserRoleMode()

  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()

  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Link href={'/'}>
            <UniIcon className=' cursor-pointer'>
              <LazyImage src="/images/logo.png" alt="logo" />
            </UniIcon>
          </Link>
          <TitleText>
            <AirdropTokensTabs />
            <LazyImage src="/images/assets/more.svg" className='more' alt="more" />
          </TitleText>
        </HeaderElement>
        <HeaderControls>
          <HeaderElement>
            <TestnetWrapper>
              
                <AirdropCard onClick={e => {
                  e.stopPropagation()
                  
                }} >
                  <Link href={'/airdrop'}>Airdrop</Link>
                  
                </AirdropCard>
            </TestnetWrapper>
            {/* <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper> */}
            {/* <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} ETH
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement> */}
          </HeaderElement>
          <HeaderElement>
            <AirdropCard style={{width: 150}}>
              <Link href={'/collect'}>Airdrop List</Link>
            </AirdropCard>
          </HeaderElement>
          <HeaderElement>
            <AirdropCard style={{width: 150}}>
              <Link href={'/tasks'}>Ongoing airdrops</Link>
            </AirdropCard>
          </HeaderElement>
          {/* <HeaderElementWrap>
            <Settings />
            <Menu />
          </HeaderElementWrap> */}
          <HeaderElementWrap>
            {/* <div
              onClick={e => {
                e.stopPropagation()
                if (isProjectMode) {

                } else {
                  router.push('/tasks')
                }
              }}
            >
              <LazyImage2
                src={ isProjectMode ? "/images/airdrop/add.svg" : "/images/airdrop/menus.svg" } className='icon-add' />
            </div> */}
            
            <LazyImage2 src={ isProjectMode ? '/images/airdrop/project.svg' : '/images/airdrop/user.svg'} className='icon-role' />
          </HeaderElementWrap>
          <Web3Status />
          <HeaderElementWrap
            onClick={toggleSetUserRoleMode}
          >
            <LazyImage src="/images/airdrop/qiehuan.svg" className='icon-qiehuan' />
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
