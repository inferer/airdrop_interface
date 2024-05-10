import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'
import { useIsUserAction, useUserAction, useUserRoleMode } from '../../state/user/hooks'
import { UserAction } from '../../constants'
import { useActiveWeb3React } from '../../hooks'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled.a<{
  className: string
}>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${({ className }) => className} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`
const NavLinkWrap = styled.span`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 18px;
  font-family: Inter-SemiBold;

  &.${({ className }) => className} {
    border-radius: 12px;
    color: ${({ theme }) => theme.text1};
  }

  a:-webkit-any-link {
    color: inherit;
    text-decoration: none;
    font-family: inherit;
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  return (
    <Tabs style={{ marginBottom: '20px' }}>
      <NavLinkWrap id={`swap-nav-link`} className={active === 'swap' ? activeClassName : ''}>
        <Link href={'/swap'} >{'swap'}</Link>
      </NavLinkWrap>
      <NavLinkWrap id={`pool-nav-link`} className={active === 'pool' ? activeClassName : ''}>
        <Link href={'/pool'} >{'pool'}</Link>
      </NavLinkWrap>
      {/* <StyledNavLink id={`swap-nav-link`} href={'/swap'} className={active === 'swap' ? activeClassName : ''} >
        {t('swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} href={'/pool'} className={active === 'pool' ? activeClassName : ''} >
        {t('pool')}
      </StyledNavLink> */}
    </Tabs>
  )
}

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <Link href="/pool">
          <StyledArrowLeft />
        </Link>
        <ActiveText>Import Pool</ActiveText>
        <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <Link href="/pool">
          <StyledArrowLeft />
        </Link>
        <ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
        <QuestionHelper
          text={
            adding
              ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
              : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}

const StyledNavLink2 = styled.div<{
  className: string
}>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 16px;
  margin-right: 24px;
  font-family: Inter-SemiBold;

  &.${({ className }) => className} {
    border-radius: 12px;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export function AirdropTokensTabs({ onClick }: { onClick?: (type: string) => void}) {
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const [ isProjectMode ] = useUserRoleMode()
  const [active, setActive] = useState<'collect' | 'rewards' | ''>('')

  const handleTab = useCallback((type) => {
    if (!account && type === 'rewards') return
    setActive(type)
    if (type === 'rewards') {
      router.push(isProjectMode ? '/project/rewards' :  '/user/rewards')
    } else {
      router.push(isProjectMode ? '/project/create' :  '/user/collect')
    }
    // onClick && onClick(type)

  }, [active, isProjectMode, account])
  const action = router.query.action ? router.query.action[0] : 'create'
  useEffect(() => {
    if (action === 'rewards' || action === 'consumption') {
      setActive('rewards')
    } else if (action === 'swap' || action === 'create' || action === 'collect') {
      setActive('collect')
    } else {
      setActive('')
    }
  }, [router.query])

  return (
    <Tabs style={{ marginLeft: 45 }}>
      <StyledNavLink2 id={`airdrop-btn-click`} className={active === 'collect' ? 'airdrop' : ''}
        onClick={() => handleTab('collect')}
      >
        {'Airdrop'}
      </StyledNavLink2>
      <StyledNavLink2 id={`tokens-btn-click`} className={active === 'rewards' ?  'airdrop' : ''}
        onClick={() => handleTab('rewards')}
      >
        {'Tokens'}
      </StyledNavLink2>
    </Tabs>
  )
}


export function SwapCreateTabs({ onClick }: { onClick?: (type: UserAction) => void}) {
  const router = useRouter()
  const [ isProjectMode, toggleSetUserRoleMode] = useUserRoleMode()
  const { userAction, setUserAction }  = useUserAction()
  const { isProjectSwap, isProjectCreate, isUserSwap, isUserCollect, isProjectCampaign } = useIsUserAction()

  const handleTab = useCallback((action: string) => {
    router.push(action)
    // setUserAction(action)
    // if (action === UserAction.USER_COLLECT) {
    //   router.push('/search')
    // } else {
    //   onClick && onClick(action)
    // }
    
  }, [])



  return (
    <Tabs style={{ justifyContent: 'flex-start', marginBottom: 22 }}>
      {
        isProjectMode ? (
          <>
            <StyledNavLink2 id={`create-btn-click`} className={isProjectCreate && !isProjectCampaign ?  'airdrop' : ''}
              onClick={() => handleTab('/project/create')}
            >
              {'Create'}
            </StyledNavLink2>
            <StyledNavLink2 id={`swap-btn-click`} className={isProjectSwap ? 'airdrop' : ''}
              onClick={() => handleTab('/project/swap')}
            >
              {'Swap'}
            </StyledNavLink2>
            <StyledNavLink2 id={`swap-btn-click`} className={isProjectCampaign ? 'airdrop' : ''}
              onClick={() => handleTab('/project/campaign')}
            >
              {'Campaign'}
            </StyledNavLink2>
            
          </>
        ) : (
          <>
            <StyledNavLink2 id={`collect-btn-click`} className={isUserCollect ?  'airdrop' : ''}
              onClick={() => handleTab('/user/collect')}
            >
              {'Collect'}
            </StyledNavLink2>
            <StyledNavLink2 id={`userswap-btn-click`} className={isUserSwap ? 'create' : ''}
              onClick={() => handleTab('/user/swap')}
            >
              {'Swap'}
            </StyledNavLink2>
            
          </>
        )
      }
      
    </Tabs>
  )
}

export function SwapCollectTabs({ onClick }: { onClick?: (type: UserAction) => void}) {
  const router = useRouter()
  const { userAction, setUserAction }  = useUserAction()

  const handleTab = useCallback((action: UserAction) => {
    setUserAction(action)
    if (action === UserAction.USER_COLLECT) {
      router.push('/search')
    } 
    if (action === UserAction.USER_SWAP) {
      router.push('/user/swap')
    } 
  }, [setUserAction, onClick])

  return (
    <Tabs style={{ justifyContent: 'flex-start', marginBottom: 22 }}>
      <>
        <StyledNavLink2 id={`collect-btn-click`} className={'airdrop'}
          onClick={() => handleTab(UserAction.USER_COLLECT)}
        >
          {'Collect'}
        </StyledNavLink2>
        <StyledNavLink2 id={`userswap-btn-click`} className={''}
          onClick={() => handleTab(UserAction.USER_SWAP)}
        >
          {'Swap'}
        </StyledNavLink2>
      </>
    </Tabs>
  )
}
