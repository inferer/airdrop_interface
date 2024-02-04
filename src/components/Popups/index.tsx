import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { useActivePopups, useShowToast, useToastData } from '../../state/application/hooks'
import { AutoColumn } from '../Column'
import PopupItem from './PopupItem'
import LazyImage, { LazyImage2 } from '../LazyImage'
import { getEtherscanLink, openBrowser } from '../../utils'
import { useActiveWeb3React } from '../../hooks'

const MobilePopupWrapper = styled.div<{ height: string | number }>`
  position: relative;
  max-width: 100%;
  height: ${({ height }) => height};
  margin: ${({ height }) => (height ? '0 auto;' : 0)};
  margin-bottom: ${({ height }) => (height ? '20px' : 0)};

  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

const MobilePopupInner = styled.div`
  height: 99%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`

const FixedPopupColumn = styled(AutoColumn)`
  position: fixed;
  top: 64px;
  right: 1rem;
  max-width: 355px !important;
  width: 100%;
  z-index: 2;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export default function Popups() {
  // get all popups
  const activePopups = useActivePopups()


  return (
    <>
      <FixedPopupColumn gap="20px">
        {activePopups.map(item => (
          <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
        ))}
      </FixedPopupColumn>
      <MobilePopupWrapper height={activePopups?.length > 0 ? 'fit-content' : 0}>
        <MobilePopupInner>
          {activePopups // reverse so new items up front
            .slice(0)
            .reverse()
            .map(item => (
              <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
            ))}
        </MobilePopupInner>
      </MobilePopupWrapper>
    </>
  )
}

const FixedPopupWrap = styled.div<{error?: boolean}>`
  width: 228px;
  min-height: 60px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid rgba(107,190,225,0.2);
  background: #FFF;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.06);
  position: fixed;
  top: 136px;
  right: 80px;
  flex-direction: row;
  display: flex;

  &.hide {
    right: -300px;
  }

  .line {
    background: linear-gradient(46deg, rgba(107, 190, 225, 0.20) 8.92%, rgba(138, 232, 153, 0.20) 71.53%);
    width: 1px;
    height: 100%;
    flex-shrink: 0;
    position: absolute;
    right: 41px;
    top: 0;
  }
  .title {
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: "DM Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px; /* 150% */
    background: var(--13, linear-gradient(46deg, #6BBEE1 8.92%, #8AE899 71.53%));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .content {
    margin-top: 4px;
    color: rgba(0, 0, 0, 0.40);
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: "DM Sans";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
  }
  .close {
    .close1 {
      display: block;
    }
    .close2 {
      display: none;
    }
    &:hover {
      border-radius: 0px 8px 8px 0px;
      background: linear-gradient(46deg, rgba(107, 190, 225, 0.04) 8.92%, rgba(138, 232, 153, 0.04) 71.53%);
      .close1 {
        display: none;
      }
      .close2 {
        display: block;
      }
    }
  }

  &.error {
    border: 1px solid rgba(248, 138, 138, 0.2);
    .line {
      background: rgba(248, 138, 138, 0.20);
    }
    .title {
      color: #F88A8A;
      background: none;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: inherit;
    }
    .close {
      &:hover {
        border-radius: 0px 8px 8px 0px;
        background: rgba(248, 138, 138, 0.20);
      }
    }
  }
`

export function PopupsNew() {

  const { chainId } = useActiveWeb3React()

  const toastData = useToastData()
  const { handleHide } = useShowToast()

  const error = useMemo(() => {
    return toastData.type && toastData.type === 'error'
  }, [toastData])

  const tipImg = useMemo(() => {
    if (error) return '/images/airdrop/error2.svg'
    return '/images/airdrop/success.svg'
  }, [error])

  const tipImg1 = useMemo(() => {
    if (error) return '/images/airdrop/error_close1.svg'
    return '/images/airdrop/success_close.svg'
  }, [error])

  const tipImg2 = useMemo(() => {
    if (error) return '/images/airdrop/error_close2.svg'
    return '/images/airdrop/success_close2.svg'
  }, [error])

  const timerRef = useRef<any>(null)
  useEffect(() => {
    if (toastData.content && toastData.type) {
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          clearTimeout(timerRef.current)
          timerRef.current = null
          handleHide()
        }, 116000)
      }
    }
    return () => {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [toastData, handleHide])

  return (
    <FixedPopupWrap className={` ${toastData.type === '' ? 'hide' : 'show'} ${error ? 'error' : ''}`} >
      <div className='w-full px-[12px] py-[9px]'>
        <div className='flex items-center'>
          <LazyImage2 src={tipImg} />
          <div className='title ml-[6px]'>{toastData.title}</div>
        </div>
        <div className='content'>
          {toastData.content}
          {
            toastData.action === 'swap' && 
            <span className=' inline-flex items-center view-etherscan'
              onClick={e => {
                e.stopPropagation()
                openBrowser(chainId && toastData.hash ? getEtherscanLink(chainId, toastData.hash, 'transaction') : '')
              }}
            >
              View on Etherscan
              <LazyImage src='/images/airdrop/link3.svg' className='ml-[6px] link3' />
              <LazyImage src='/images/airdrop/link4.svg' className='ml-[6px] link4' />
            </span>
          }
        </div>
      </div>
      <div className='line'></div>
      <div className='w-[41px] shrink-0 flex items-center justify-center cursor-pointer close '
        onClick={e => {
          e.stopPropagation()
          clearTimeout(timerRef.current)
          timerRef.current = null
          handleHide()
        }}
      >
        <LazyImage2 src={tipImg1} className='close1' />
        <LazyImage2 src={tipImg2} className='close2' />
      </div>
    </FixedPopupWrap>
  )
}
