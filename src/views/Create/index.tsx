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
import { Link } from '../../components/AppRouter'
import { useCreateAirdrop, useCreateCallback } from '../../hooks/useAirdropSender'
import { ApprovalState } from '../../hooks/useApproveCallback'
import { AutoRow } from '../../components/Row'
import Loader from '../../components/Loader'
import { Token } from '@uniswap/sdk'

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
    approvalState,
    approve
  } = useCreateCallback(undefined, undefined, undefined, null)


  const { handleCreateAirdrop } = useCreateAirdrop(args, lockedCurrency as Token ?? undefined)


  return (
    <CreateBody>
      <TitleWrap>
        <Link to="/swap">
          <LazyImage className='icon-left cursor-pointer' src="/images/airdrop/arrow-left.svg" />
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
                Social
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
                <div className='mt-2'>
                  <Select title='Twitter' />
                </div>
              </div>
              <div className='ml-[64px]'>
                <ItemTitle>Action</ItemTitle>
                <div className='mt-2'>
                  <Select title='Like' />
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
          {
            lockedCurrency &&
            <ButtonSwap
              onClick={approve}
            >
              <TYPE.textGrad1 fontWeight={600} fontSize={20}>
                { approvalState === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalState === ApprovalState.APPROVED ? (
                    'Approved'
                  ) : (
                    `Approve ${lockedCurrency?.symbol}`
                  )
                }
              </TYPE.textGrad1>
            </ButtonSwap>
          }
          
        </div>
        <div className='w-[260px]'>
          <ButtonSwap 
            onClick={e => {
              e.stopPropagation()
              handleCreateAirdrop(name, 'Social', 'Twitter', 'Like', content)
            }}
          >
            <TYPE.textGrad1 fontWeight={600} fontSize={20}>
              {
                'Confirm'
              }
            </TYPE.textGrad1>
          </ButtonSwap>
        </div>
        
      </div>
      
    </CreateBody>
  )
}
