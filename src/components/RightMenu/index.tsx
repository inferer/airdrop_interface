import React, { useRef } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'

import LazyImage, { LazyImage2 } from '../LazyImage'
import { useShowRightMenu, useUserRoleMode } from '../../state/user/hooks'
import { useActiveWeb3React } from '../../hooks'
import { shortenAddress } from '../../utils'
import useCopyClipboard from '../../hooks/useCopyClipboard'
import CopyHelper from '../AccountDetails/Copy'
import { useRouter } from 'next/router'


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
  onClick?: () => void
}> = ({
  icon,
  text,
  active,
  onClick
}) => {
  return (
    <div onClick={e => {
      e.stopPropagation()
      onClick && onClick()
    }} className='flex justify-between items-center cursor-pointer'>
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
    <div className='flex justify-between items-center py-6'>
      <div className=' rounded-lg bg-white flex justify-center items-center w-[36px]'>
      </div>
      <div className='pl-4 text-[16px] font-fbold flex-1'>
        <div className='bg-[rgba(63,60,255,0.20)] w-full h-[1px]'></div>
      </div>
    </div>
  )
}

export default function RightMenu() {
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const [ isCopied, staticCopy ] = useCopyClipboard()

  const node = useRef<HTMLDivElement>()
  const { showRightMenu, toggleShowRightMenu } = useShowRightMenu()

  useOnClickOutside(node, showRightMenu ? toggleShowRightMenu : undefined)
  const [ isProjectMode, toggleSetUserRoleMode] = useUserRoleMode()

  const handleClick = (action: string) => {
    if (action === 'switch') {
      console.log(router.pathname)
      if (router.pathname === '/search') {
        router.push('/swap')
        setTimeout(() => {
          toggleSetUserRoleMode()
        }, 300)
      } else {
        toggleSetUserRoleMode()
      }
      
      
      // router.push('/swap')
      // setTimeout(() => {
      //   toggleSetUserRoleMode()
      // }, 300)
      toggleShowRightMenu()
      return
    }
    if (action === 'tokens') {
      router.push('/rewards')
      return
    }
    if (action === 'tasks') {
      router.push('/tasks')
    }
    if (action === 'home') {
      router.push('/swap')
    }
    toggleShowRightMenu()
  }

  return (
    <RightWrap open={showRightMenu} ref={node as any}>
      <RightContent>
        <div className=' flex justify-between mt-2 mb-[18px]'>
          <div className=' cursor-pointer'
            onClick={e => {
              e.stopPropagation()
              handleClick('home')
            }}
          >
            <LazyImage src='/images/airdrop/home.svg' />
          </div>
          <div className=' cursor-pointer'
            onClick={e => {
              e.stopPropagation()
              toggleShowRightMenu()
            }}
          >
            <LazyImage src='/images/airdrop/right2.svg' />
          </div>
        </div>
        <div className=' flex items-center justify-center flex-col'>
          <div className=' w-[100px] h-[100px] rounded-full bg-[rgba(63,60,255,0.10)] flex justify-center items-center'>
            <LazyImage2 src={ isProjectMode ? '/images/airdrop/project.svg' : '/images/airdrop/user.svg'} className='icon-role w-[45px] h-[45px]' />
          </div>
          <div className='text-[15px] font-fnormal text-[#3F4664] mt-2 flex items-center'>
            {account && shortenAddress(account)}
            {/* <div onClick={e => {
              e.stopPropagation()
              staticCopy(account || '')
            }}>
              <LazyImage src='/images/airdrop/copy.svg' className='ml-2 cursor-pointer' />
            </div> */}
            <div className='ml-1'>
              <CopyHelper toCopy={account || ''} >
              
              </CopyHelper>
            </div>
            
          </div>
        </div>
        <div className='px-3'>
          <div className='mt-[65px] rounded-[6px] px-6 py-[18px]' style={{'background': 'linear-gradient(135deg, rgba(63, 60, 255, 0.06) 0%, rgba(107, 190, 225, 0.06) 100%)'}}>
            <MenuItem icon='/images/airdrop/switch2.svg' text='Switch airdrop role'
              onClick={() => handleClick('switch')}
            />
            <MenuLine />
            <MenuItem icon='/images/airdrop/airdrop2.svg' text='Airdrops tokens' 
              onClick={() => handleClick('tokens')}
            />
            <MenuLine />
            <MenuItem icon='/images/airdrop/ongoing.svg' text='Ongoing airdrops' 
              onClick={() => handleClick('tasks')}
            />
            <MenuLine />
            <MenuItem icon='/images/airdrop/completed.svg' text='Completed airdrops' />
          </div>
        </div>
        
      </RightContent>
    </RightWrap>
  )
}
