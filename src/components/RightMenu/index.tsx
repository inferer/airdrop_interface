import React, { useRef } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import useToggle from '../../hooks/useToggle'

import LazyImage, { LazyImage2 } from '../LazyImage'
import { useShowRightMenu, useUserRoleMode } from '../../state/user/hooks'
import Web3Status from '../Web3Status'


const RightWrap = styled.div<{ open: boolean }>`
  position: fixed;
  right: ${({ open }) => (open ? 0 : '-400px')};
  top: 0;
  z-index: 9;
  width: 380px;
  height: 100vh;
  border-radius: 10px;
  background: #fff;
  transition: all ease-in 0.3s;
`
const RightContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(107, 190, 225, 0.06) 0%, rgba(138, 232, 153, 0.06) 100%);
  padding: 40px;

  #web3-status-connected {
    width: auto;
    margin-left: 8px;
    margin-right: 24px;
  }
`

const MenuItem: React.FC<{
  text: string,
  active?: boolean
  onClick?: () => void
}> = ({
  text,
  active,
  onClick
}) => {
  return (
    <div onClick={e => {
      e.stopPropagation()
      onClick && onClick()
    }} className='px-[24px] py-[18px] bg-white rounded-md font-fnormal text-[16px] cursor-pointer flex items-center mb-5'>
      <LazyImage src={ active ? '/images/airdrop/selected.svg' : '/images/airdrop/select.svg' } />
      <div className='ml-4'>{text}</div>
    </div>
  )
}

export default function RightMenu() {
  const node = useRef<HTMLDivElement>()
  const [open, toggle] = useToggle(false)
  const { showRightMenu, toggleShowRightMenu } = useShowRightMenu()

  useOnClickOutside(node, showRightMenu ? toggleShowRightMenu : undefined)
  const [ isProjectMode, toggleSetUserRoleMode] = useUserRoleMode()

  const handleClick = (action: string) => {
    if (action === 'switch') {
      toggleSetUserRoleMode()
    }
  }

  return (
    <RightWrap open={showRightMenu} ref={node as any}>
      <RightContent>
        {/* <div className=' absolute top-[10px] -left-[30px]'>
          <LazyImage src='/images/airdrop/arrow-right.svg' />
        </div> */}
        <div className=' flex items-center justify-start'>
          <div className=''>
            <LazyImage2 src={ isProjectMode ? '/images/airdrop/project.svg' : '/images/airdrop/user.svg'} className='icon-role' />
          </div>
          <Web3Status />
          {/* <div
            className=' cursor-pointer'
            onClick={toggleSetUserRoleMode}
          >
            <LazyImage src="/images/airdrop/qiehuan.svg" className='icon-qiehuan' />
          </div> */}
        </div>
        <div className='mt-[32px]'>
          <MenuItem text='Switch airdrop role'
            onClick={() => handleClick('switch')}
          />
          <MenuItem text='Airdrops tokens' />
          <MenuItem text='Ongoing airdrops' />
          <MenuItem text='Completed airdrops' />
        </div>
      </RightContent>
    </RightWrap>
  )
}
