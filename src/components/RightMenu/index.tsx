import React, { useCallback, useRef } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

import LazyImage, { LazyImage2, LazyImage4 } from '../LazyImage'
import { useShowRightMenu, useUserRoleMode } from '../../state/user/hooks'
import { useActiveWeb3React } from '../../hooks'
import { shortenAddress } from '../../utils'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { Tooltip2 } from '../Tooltip'
import { APP_INFERER_CONNECTOR } from '../../connectors'


const RightWrap = styled.div<{ open: boolean }>`
  position: fixed;
  right: ${({ open }) => (open ? 0 : '-400px')};
  top: 0;
  z-index: 9;
  width: 380px;
  height: 100vh;
  background: #FFF;
  box-shadow: -4px 4px 40px 0px rgba(0, 0, 0, 0.03);
  transition: all ease-in 0.3s;
`
const RightContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  padding: 20px;

  #web3-status-connected {
    width: auto;
    margin-left: 8px;
    margin-right: 24px;
  }
`

const MenuItem: React.FC<{
  icon: string,
  text: string,
  active?: boolean
  isProjectMode?: boolean
  onClick?: () => void
}> = ({
  icon,
  text,
  active,
  isProjectMode,
  onClick
}) => {
  return (
    <div onClick={e => {
      e.stopPropagation()
      onClick && onClick()
    }} className={`flex justify-between items-center cursor-pointer p-6 ${isProjectMode ? 'menu-item' : 'menu-item-user'}`}>
      <div className=' rounded-lg bg-white flex justify-center items-center w-[36px] h-[36px]'>
        <LazyImage src={icon} />
      </div>
      <div className='pl-4 text-[16px] font-fbold flex-1'>{text}</div>
    </div>
  )
}
const MenuLine: React.FC<{
  
}> = ({
  
}) => {
  return (
    <div className='flex justify-between items-center'>
      <div className=' rounded-lg bg-white flex justify-center items-center w-[36px]'>
      </div>
      <div className='pl-4 text-[16px] font-fbold flex-1'>
        <div className='bg-[rgba(63,60,255,0.20)] w-full h-[1px]'></div>
      </div>
    </div>
  )
}

export default function RightMenu() {
  const { deactivate } = useWeb3React()
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const [ isCopied, staticCopy ] = useCopyClipboard()

  const node = useRef<HTMLDivElement>()
  const { showRightMenu, toggleShowRightMenu } = useShowRightMenu()
  useOnClickOutside(node, showRightMenu ? toggleShowRightMenu : undefined)
  const [ isProjectMode, toggleSetUserRoleMode] = useUserRoleMode()

  const handleClick = useCallback((action: string) => {
    toggleShowRightMenu(!showRightMenu)
    // setTimeout(() => {
    //   toggleShowRightMenu()
    // }, 300)
    console.log(router.pathname, router.query.action)
    if (action === 'switch') {
      localStorage.setItem('airdrop_model', !isProjectMode ? 'true' : 'false')
      if (!isProjectMode) {
        router.push('/project/create')
      } else {
        router.push('/user/collect')
      }

    }
    if (action === 'tokens') {
      if (isProjectMode) {
        router.push('/project/rewards')
      } else {
        router.push('/user/rewards')
      }
      return
    }
    if (action === 'ongoing') {
      if (isProjectMode) {
        router.push('/project/ongoing')
      } else {
        router.push('/user/ongoing')
      }
    }
    if (action === 'home') {
      if (isProjectMode) {
        router.push('/project/create')
      } else {
        router.push('/user/collect')
      }
    }
    if (action === 'completed') {
      if (isProjectMode) {
        router.push('/project/completed')
      } else {
        router.push('/user/completed')
      }
    }
    if (action === 'invite') {
      if (isProjectMode) {
        router.push('/project/invite')
      } else {
        router.push('/user/invite')
      }
    }
   }, [router, isProjectMode, showRightMenu])

  return (
    <RightWrap open={showRightMenu} ref={node as any}>
      <RightContent>
        <div className=' flex justify-between mt-2 mb-[18px] relative'>
          {
            showRightMenu && 
            <div className=' absolute top-0 -left-[68px] cursor-pointer'
              onClick={e => {
                e.stopPropagation()
                toggleShowRightMenu()
              }}
            >
              <LazyImage src='/images/airdrop/arrow-right.svg' />
            </div>
          }
          
          <div className=' cursor-pointer'
            onClick={e => {
              e.stopPropagation()
              handleClick('home')
            }}
          >
            <LazyImage4 src='/images/airdrop/home.svg' activeSrc={ isProjectMode ? '/images/airdrop/home2.svg' : '/images/airdrop/home4.svg' } />
          </div>
          <div className=' cursor-pointer'
            onClick={e => {
              e.stopPropagation()
              localStorage.removeItem(APP_INFERER_CONNECTOR)
              deactivate()
              toggleShowRightMenu()
              router.push(isProjectMode ? '/project/swap' : '/user/swap')
            }}
          >
            <LazyImage4 src='/images/airdrop/right2.svg' activeSrc={ isProjectMode ? '/images/airdrop/right3.svg' : '/images/airdrop/right4.svg'} />
          </div>
        </div>
        <div className=' flex items-center justify-center flex-col'>
          <div className=' w-[100px] h-[100px] rounded-full bg-[rgba(63,60,255,0.10)] flex justify-center items-center avatar-bg'>
            <LazyImage2 src={ isProjectMode ? '/images/airdrop/project.svg' : '/images/airdrop/user.svg'} className='icon-role w-[45px] h-[45px]' />
          </div>
          <div className='text-[15px] font-fnormal text-[#3F4664] mt-2 flex items-center'>
            {account && shortenAddress(account)}
            <div
              className='ml-2'
              onClick={e => {
                e.stopPropagation()
                staticCopy(account || '')
              }}>
              <Tooltip2 text={isCopied ? 'Copied' : 'Copy' } >
                <LazyImage4 src='/images/airdrop/copy.svg' activeSrc='/images/airdrop/copy2.svg' className='cursor-pointer' />
              </Tooltip2>
            </div>
            {/* <div className='ml-1'>
              <CopyHelper toCopy={account || ''} >
              
              </CopyHelper>
            </div> */}
            <Tooltip2 text='View on Etherscan' className='ml-1' >
              <LazyImage4 src='/images/airdrop/open.svg' activeSrc='/images/airdrop/open2.svg' />
            </Tooltip2>
          </div>
        </div>
        <div className='px-3'>
          <div className='mt-[65px] rounded-[6px]' style={{'background': isProjectMode ? 'linear-gradient(135deg, rgba(63, 60, 255, 0.09) 0%, rgba(107, 190, 225, 0.09) 100%)' : 'linear-gradient(135deg, rgba(107, 190, 225, 0.09) 0%, rgba(138, 232, 153, 0.09) 100%)'}}>
           
            <MenuItem icon='/images/airdrop/ongoing.svg' text='Ongoing Airdrops' isProjectMode={isProjectMode} 
              onClick={() => handleClick('ongoing')}
            />
            <MenuLine />
            <MenuItem icon='/images/airdrop/completed.svg' text='Completed Airdrops' isProjectMode={isProjectMode} 
              onClick={() => handleClick('completed')}
            />
            <MenuLine />
            <MenuItem icon='/images/airdrop/airdrop2.svg' text='Airdrops Tokens' isProjectMode={isProjectMode}
              onClick={() => handleClick('tokens')}
            />
            <MenuLine />
            <MenuItem icon='/images/airdrop/switch2.svg' text='Switch Airdrop Role' isProjectMode={isProjectMode}
              onClick={() => handleClick('switch')}
            />
            <MenuLine />
            <MenuItem icon='/images/airdrop/invite.svg' text='Invitation Code' isProjectMode={isProjectMode} 
              onClick={() => handleClick('invite')}
            />
            

          </div>
        </div>
        <div className=' absolute w-full flex justify-center left-0 right-0 bottom-[16px]'>
          {
            isProjectMode ? 
            <>
              <LazyImage src='/images/airdrop/beta_icon.svg' />
              <span className=' text-[11px] text-[rgba(63,60,255,0.5)] font-fsemibold mx-[2px]'>beta 1712365129</span>
              <LazyImage src='/images/airdrop/beta_icon.svg' />
            </> :
            <>
              <LazyImage src='/images/airdrop/beta_icon_user.svg' />
              <span className=' text-[11px] text-[rgba(127,200,139,0.8)] font-fsemibold mx-[2px]'>beta 1712365129</span>
              <LazyImage src='/images/airdrop/beta_icon_user.svg' />            
            </>
          }
          
        </div>
      </RightContent>
    </RightWrap>
  )
}
