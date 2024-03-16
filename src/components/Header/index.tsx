import { ChainId } from '@uniswap/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager, useLoginUserInfo, useShowRightMenu, useUserRoleMode } from '../../state/user/hooks'
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

import router, { useRouter } from 'next/router'
import WalletModal from '../WalletModal'
import useENSName from '../../hooks/useENSName'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  padding-left: 4.1666vw;
  padding-right: 4.1666vw;
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
  [ChainId.LOCAL]: 'Local'
}

export default function Header() {
  const router = useRouter()
  
  const { account, chainId } = useActiveWeb3React()
  const [ isProjectMode, toggleSetUserRoleMode] = useUserRoleMode()
  const { showRightMenu, toggleShowRightMenu } = useShowRightMenu()
  const loginUserInfo = useLoginUserInfo()

  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()

  const { ENSName } = useENSName(account ?? undefined)

  return (
    <HeaderFrame>
      <div className='h-[84px] flex items-center justify-between w-full'>
        <HeaderElement>
          <div
            onClick={e => {
              e.stopPropagation()
              if (router.pathname === '/join') return
              router.push(isProjectMode ? '/project/create' :  '/user/collect')
            }}
          >
            <UniIcon className=' cursor-pointer'>
              <LazyImage src="/images/logo.png" alt="logo" />
            </UniIcon>
          </div>
          {
            router.pathname !== '/join' && 
            <TitleText>
              <AirdropTokensTabs />
              <LazyImage src="/images/assets/more.svg" className='more' alt="more" />
            </TitleText>
          }
          
        </HeaderElement>
        {
          account && loginUserInfo.address && 
          <div className='flex items-center h-[48px] px-3 connect-bg cursor-pointer'

            onClick={e => {
              e.stopPropagation()
              toggleShowRightMenu(true)
            } }
          >
            <HeaderElementWrap>
              <LazyImage2 src={ isProjectMode ? '/images/airdrop/project.svg' : '/images/airdrop/user.svg'} className='icon-role' />
            </HeaderElementWrap>
            <Web3Status />
            <HeaderElementWrap>
              <LazyImage src="/images/airdrop/qiehuan.svg" className='icon-qiehuan' />
            </HeaderElementWrap>
          </div>
        }
        <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={[]} confirmedTransactions={[]} />
      </div>
    </HeaderFrame>
  )
}
