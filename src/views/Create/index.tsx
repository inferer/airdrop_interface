import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'

import {  TYPE } from '../../theme'
import { ButtonSwap } from '../../components/Button'

import { useActiveWeb3React } from '../../hooks'
import { Dots } from '../../components/swap/styleds'
import { CreateBody, ItemBox, ItemCenter, ItemTitle, ItemWrap, TitleWrap, TokenInfo } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import Input from '../../components/TextInput/Input'
import Select from './Select'
import SelectInput from './Select2'
import { Link } from '../../components/AppRouter'
import { useCreateAirdrop, useCreateCallback } from '../../hooks/useAirdropSender'
import { ApprovalState } from '../../hooks/useApproveCallback'
import { AutoRow } from '../../components/Row'
import Loader, { Loading, LoadingX } from '../../components/Loader'
import { ETHER, Token } from '@uniswap/sdk'
import { TWITTER_UNIT } from '../../constants'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useRouter } from 'next/router'

let globalApproveCount = 0

let globalApproveList: string[] = ['usdt', 'label']

export default function Create() {
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const [name, setName] = useState('')

  const [content, setContent] = useState('https://twitter.com/intent/like?tweet_id=17203739135769 52121')

  const {
    args,
    lockedAmount,
    lockedAmountAB,
    lockedCurrency,
    lockedCurrencyAir,
    lockedCurrencyAmount,
    outputAmount,
    approvalState,
    approve,
    approvalStateLabel,
    approveLabel,
    approvalStateAir,
    approveAir
  } = useCreateCallback(undefined, undefined, undefined, null)

  const { createStatus, handleCreateAirdrop } = useCreateAirdrop(args, lockedCurrency as Token ?? undefined)

  const label = useMemo(() => {
    return outputAmount?.currency?.symbol?.slice(4) || ''
  }, [outputAmount])

  const [action, setAction] = useState<string>('like')
  const handleChange = (data: any) => {
    console.log(data)
    setAction(data.value)
  }

  const [approveLoading, setApproveLoading] = useState(true)
  const [unApproveList, setUnApproveList] = useState<string[]>(globalApproveList)

  useEffect(() => {
    if (approvalState !== ApprovalState.UNKNOWN && approvalStateLabel !== ApprovalState.UNKNOWN) {
      setApproveLoading(false)
    }
    if (approvalState === ApprovalState.APPROVED) {
      const _index = unApproveList.findIndex(label => label === 'usdt')
      if (_index > -1) {
        const newList = [...unApproveList]
        newList.splice(_index, 1)
        setUnApproveList(newList)
      }
    }
    if (approvalStateLabel === ApprovalState.APPROVED) {
      const _index = unApproveList.findIndex(label => label === 'label')
      if (_index > -1) {
        const newList = [...unApproveList]
        newList.splice(_index, 1)
        setUnApproveList(newList)
      }
    }
  }, [approvalState, approvalStateLabel, unApproveList])


  const approveA = useMemo(() => {
    return approvalState === ApprovalState.NOT_APPROVED && (lockedCurrency && lockedCurrency !== ETHER )
  }, [lockedCurrency, approvalState])

  const approveB = useMemo(() => {
    return approvalStateLabel === ApprovalState.NOT_APPROVED && !!outputAmount
  }, [outputAmount, approvalStateLabel])

  return (
    <CreateBody>
      <TitleWrap>
        {/* <Link to="/swap">
          <div>
          <LazyImage className='icon-left cursor-pointer' src="/images/airdrop/arrow-left.svg" />
          </div>
        </Link> */}
        
        <div className=' text-[32px] font-fsemibold text-black'>Create the airdrop</div>
      </TitleWrap>
      <ItemWrap>
        <div>
          <ItemBox>
            <ItemTitle>airdrop name</ItemTitle>
            <Input value={name} onUserInput={value => {
              setName(value)
            }} />
          </ItemBox>
          <ItemBox style={{ marginTop: 20, height: 'auto'}}>
            <ItemTitle>offer</ItemTitle>
            <div className='flex justify-between items-center'>
              {/* <Input value={''} placeholder='10' onUserInput={function (input: string): void {
                throw new Error('Function not implemented.')
              } } /> */}
              <div className=' text-[32px] font-fsemibold text-[rgba(0,0,0,0.40)]'>{lockedAmount}</div>
              <TokenInfo className='flex items-center shrink-0'>
                {/* <LazyImage2 src='/images/airdrop/eth.svg' /> */}
                <CurrencyLogo type='create' currency={lockedCurrency || undefined} size={'24px'} />
                <div className='text-[20px] font-fsemibold ml-1'>{lockedCurrency?.symbol}</div>
              </TokenInfo>
            </div>
            {
              Number(lockedAmountAB.lockedAmountBShow) > 0 ? 
              <div className='flex justify-end mt-2'>
                <div className='bg-[rgba(200,206,255,0.20)] rounded-[100px] h-[26px] px-[6px] flex items-center text-[rgba(0,0,0,0.40)] text-[14px]'>
                  <div className=' flex items-center'>
                    <CurrencyLogo type='create' currency={lockedCurrency || undefined} size={'14px'} />
                    <span className='mx-1'>{lockedAmountAB.lockedAmountAShow}</span>
                    {lockedCurrency?.symbol}
                  </div>
                  <LazyImage src='/images/airdrop/add2.svg' className='mx-1' />
                  <div className=' flex items-center'>
                    <CurrencyLogo currency={outputAmount?.currency} size={'14px'} />
                    <span className='mx-1'>{lockedAmountAB.lockedAmountBShow}</span>
                    {outputAmount?.currency?.symbol}
                  </div>
                </div> 
              </div> : null
            }
            

          </ItemBox>
          <div className='flex justify-between mt-5'>
            <ItemBox width={180}>
              <ItemTitle>pool</ItemTitle>
              <div className=' text-[14px] font-fsemibold mt-2 p-4 text-[rgba(0,0,0,0.40)]'>
                {label}
              </div>
            </ItemBox>
            <ItemBox width={180}>
              <ItemTitle>duration</ItemTitle>
              <div className=' text-[14px] font-fsemibold mt-2 p-4'>
                1 day
              </div>
            </ItemBox>
          </div>

        </div>
        <ItemCenter></ItemCenter>
        <div>
          <ItemBox width={664} height={244}>
            <div className='flex w-full'>
              <div>
                <ItemTitle>Channel</ItemTitle>
                <div className='mt-2 font-fmedium'>
                  <Select title='Twitter' />
                </div>
              </div>
              <div className='ml-[40px]'>
                <ItemTitle>Action</ItemTitle>
                <div className='mt-2 font-fmedium'>
                  <SelectInput onChange={handleChange} />
                </div>
              </div>
              <div className='ml-[34px]'>
                <div className='mt-1'>
                  <LazyImage src='/images/airdrop/to.svg' />
                </div>
                
              </div>
              <div className='ml-[34px] shrink-0'>
                <ItemTitle>Offer per unit</ItemTitle>
                <div className='mt-2'>
                  {/* <Select title='2X' /> */}
                  <div className='flex items-center justify-between font-fsemibold text-[16px] py-3 px-4 bg-[rgba(85,123,241,0.02)] rounded-[8px]'>
                    <div>{TWITTER_UNIT[action]} x</div>
                    <div className='bg-[#F2F9F3] rounded flex items-center py-[1px] px-2 ml-[11px]'>
                      {/* <LazyImage src='/images/airdrop/airdrop_icon.svg' /> */}
                      <CurrencyLogo currency={outputAmount?.currency} size={'20px'} />
                      <div className=' font-fmedium text-[#A1CEA8] ml-1'>
                        {outputAmount?.currency?.symbol}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-4'>
              <ItemTitle>Content</ItemTitle>
              <div className='mt-2 py-3 px-4 h-[90px] bg-[rgba(85,123,241,0.02)] rounded-lg overflow-auto'>
                <textarea className=' w-full h-full bg-[rgba(85,123,241,0)] outline-none leading-6'
                  value={content}
                  onChange={() => {

                  }}
                >
                
                </textarea>
              </div>
            </div>
          </ItemBox>
          
          <div className='h-[121px] bg-[rgba(123,120,255,0.06)] rounded-xl px-4 py-[18px] mt-5'>
            <div className=' font-fsemibold text-[#7B78FF] text-base'>Airdrop assets would be locked in contract.</div>
            <div className=' text-[#7B78FF] text-[14px] mt-3'>When you try to create an airdrop, the associated token assets would be locked in contract, and you would receive same amount of correspondant “air-” tokens, which are permitted to trade in airdrop pools.</div>
          </div>
        </div>
      </ItemWrap>
      <div className='flex justify-end mt-5'>
        <div className='w-[260px]'>
          <ButtonSwap 
            bgColor='#FAFAFA'
            onClick={e => {
              e.stopPropagation()
              router.push('/swap')
            }}
          >
            <span className='text-[rgba(0,0,0,0.6)] font-fsemibold text-[20px]'>Cancel</span>
          </ButtonSwap>
        </div>
        <div className='min-w-[260px] ml-[50px]'>
        {
          approveLoading ? 
          <ButtonSwap 
            bgColor='rgba(123,120,255,0.1)'
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <Loading />
            
          </ButtonSwap> : 
          <>
          {
            approveA ? 
            <ButtonSwap 
              bgColor='rgba(123,120,255,0.1)'
              onClick={e => {
                e.stopPropagation()
                approve()
              }}
            >
              <div className='text-[rgba(123,120,255,0.9)] font-fsemibold text-[20px]'>
                Approve {lockedCurrency?.symbol} (1/{approveB ? 2 : 1})
              </div>
              
            </ButtonSwap> : null
            
          }
          {
            approveB && unApproveList.length === 1 ? 
            <ButtonSwap 
              bgColor='rgba(123,120,255,0.1)'
              onClick={e => {
                e.stopPropagation()
                approveLabel()
              }}
            >
              <div className='text-[rgba(123,120,255,0.9)] font-fsemibold text-[20px]'>
                Approve {outputAmount?.currency?.symbol} ({approveA ? 2 : 1}/{approveA ? 2 : 1})
              </div>
              
            </ButtonSwap> : null
          }
          {
            (approvalState === ApprovalState.PENDING || approvalStateLabel === ApprovalState.PENDING ) ?
            <ButtonSwap 
              bgColor='rgba(123,120,255,0.1)'
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <LoadingX />
            </ButtonSwap> : null
          }
          </>
        }
        {
          !approveLoading && approvalState === ApprovalState.APPROVED && approvalStateLabel === ApprovalState.APPROVED &&
            <ButtonSwap 
              onClick={e => {
                e.stopPropagation()
                if (createStatus === 1) return
                if (!name) {
                  alert('Airdrop name is empty!')
                  return
                }
                if (approvalState !== ApprovalState.APPROVED || approvalStateLabel !== ApprovalState.APPROVED) {
                  alert('Please approve token!')
                  return
                }
                handleCreateAirdrop(name, label, 'Twitter', action, TWITTER_UNIT[action], content, lockedAmountAB.lockedAmountA, lockedAmountAB.lockedAmountB)
              }}
            >
              <TYPE.textGrad1 fontWeight={600} fontSize={20}>
                {
                  createStatus === 1 ? <LoadingX /> : 'Confirm'
                }
              </TYPE.textGrad1>
            </ButtonSwap>
        }
        </div>
      </div>
      
    </CreateBody>
  )
}
