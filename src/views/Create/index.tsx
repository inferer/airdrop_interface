import React, { useContext, useMemo, useState } from 'react'
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
import Loader from '../../components/Loader'
import { Token } from '@uniswap/sdk'
import { TWITTER_UNIT } from '../../constants'



export default function Create() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const [name, setName] = useState('')

  const [content, setContent] = useState('https://twitter.com/intent/like?tweet_id=17203739135769 52121')

  const {
    args,
    lockedAmount,
    lockedCurrency,
    lockedCurrencyAmount,
    outputAmount,
    approvalState,
    approve,
    approvalStateLabel,
    approveLabel
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


  return (
    <CreateBody>
      <TitleWrap>
        <Link to="/swap">
          <div>
          <LazyImage className='icon-left cursor-pointer' src="/images/airdrop/arrow-left.svg" />
          </div>
        </Link>
        
        <TYPE.textGrad1 fontSize={32} fontWeight={600}>Create the airdrop</TYPE.textGrad1>
      </TitleWrap>
      <ItemWrap>
        <div>
          <ItemBox>
            <ItemTitle>airdrop name</ItemTitle>
            <Input value={name} onUserInput={value => {
              setName(value)
            }} />
          </ItemBox>
          <ItemBox style={{ marginTop: 20}}>
            <ItemTitle>offer</ItemTitle>
            <div className='flex justify-between items-center'>
              {/* <Input value={''} placeholder='10' onUserInput={function (input: string): void {
                throw new Error('Function not implemented.')
              } } /> */}
              <div className=' text-[32px] font-fsemibold'>{lockedAmount}</div>
              <TokenInfo className='flex items-center mt-5 shrink-0'>
                <LazyImage2 src='/images/airdrop/eth.svg' />
                <div className='text-[20px] font-fsemibold ml-1'>{lockedCurrency?.symbol}</div>
              </TokenInfo>
            </div>
          </ItemBox>
          <div className='flex justify-between mt-5'>
            <ItemBox width={180}>
              <ItemTitle>pool</ItemTitle>
              <div className=' text-[14px] font-fsemibold mt-2 p-4'>
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
                      <LazyImage src='/images/airdrop/airdrop_icon.svg' />
                      <div className=' font-fmedium text-[#A1CEA8]'>
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
        
          {
            lockedCurrency &&
            <div className='w-[260px]'>
              <ButtonSwap
                onClick={approve}
              >
                <TYPE.textGrad1 fontWeight={600} fontSize={20}>
                  { approvalState === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        Approving <Loader />
                      </AutoRow>
                    ) : approvalState === ApprovalState.APPROVED ? (
                      'Approved ' + lockedCurrency?.symbol
                    ) : (
                      `Approve ${lockedCurrency?.symbol}`
                    )
                  }
                </TYPE.textGrad1>
              </ButtonSwap>
            </div>
          }
        
          {
            outputAmount &&
            <div className='w-[260px]'>
              <ButtonSwap
                onClick={approveLabel}
              >
                <TYPE.textGrad1 fontWeight={600} fontSize={20}>
                  { approvalStateLabel === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        Approving <Loader />
                      </AutoRow>
                    ) : approvalStateLabel === ApprovalState.APPROVED ? (
                      'Approved ' + outputAmount?.currency?.symbol
                    ) : (
                      `Approve ${outputAmount?.currency?.symbol}`
                    )
                  }
                </TYPE.textGrad1>
              </ButtonSwap>
            </div>
          }
        
        <div className='w-[260px]'>
          <ButtonSwap 
            onClick={e => {
              e.stopPropagation()
              if (!name) {
                alert('Airdrop name is empty!')
                return
              }
              handleCreateAirdrop(name, label, 'Twitter', action, TWITTER_UNIT[action], content)
            }}
          >
            <TYPE.textGrad1 fontWeight={600} fontSize={20}>
              {
                createStatus === 1 ? <Loader /> : 'Confirm'
              }
            </TYPE.textGrad1>
          </ButtonSwap>
        </div>
        
      </div>
      
    </CreateBody>
  )
}
