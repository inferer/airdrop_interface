import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {  TYPE } from '../../theme'
import { ButtonCancel, ButtonSwap } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { CreateBody, ItemBox, ItemBox2, ItemCenter, ItemTitle, ItemWrap, TitleWrap, TokenInfo } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import Input from '../../components/TextInput/Input'
import Select from './Select'
import SelectInput from './Select2'
import { useCreateAirdrop, useCreateCallback } from '../../hooks/useAirdropSender'
import { ApprovalState } from '../../hooks/useApproveCallback'
import { Loading, LoadingX } from '../../components/Loader'
import { ETHER, Token } from '@uniswap/sdk'
import { AIRDROP_DURATION, CHANNEL_LIST, TWITTER_ACTION, TWITTER_UNIT } from '../../constants'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useRouter } from 'next/router'

let globalApproveCount = 0

let globalApproveList: string[] = ['usdt', 'label']

export default function Create() {
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState(false)
  const [errorCode, setErrorCode] = useState(1)
  const [approvedTokenA, setApprovedTokenA] = useState(false)

  const [content, setContent] = useState('https://twitter.com/intent/like?tweet_id=1720373913576952121')

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
    setAction(data.value)
  }
  const [duration, setDutation] = useState('1')
  const handleDurationChange = (data: any) => {
    setDutation(data.value)
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
        
        <div className=' text-[32px] font-fsemibold text-black leading-normal' style={{lineHeight: 'normal'}}>Create the airdrop</div>
      </TitleWrap>
      <ItemWrap>
        <div>
          <ItemBox2
            error={nameError && name.length <= 0}
            errorCode={errorCode}
          >
            <div className='content bg-white h-full'>
              <ItemTitle>airdrop name</ItemTitle>
              <Input style={{ lineHeight: '40px'}} focus value={name} 
                onFocus={e => {
                  setErrorCode(1)
                }}
                onBlur={e => {
                  setErrorCode(2)
                }}
                onUserInput={value => {
                  setName(value)
                  setErrorCode(value.length <= 0 ? -1 : 1)
                }} 
              />
            </div>
            
          </ItemBox2>
          <ItemBox style={{ marginTop: 20, height: '144px'}}>
            <ItemTitle>offer</ItemTitle>
            <div className='flex justify-between items-center mt-2'>
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
            <ItemBox width={180} height={100}>
              <ItemTitle>pool</ItemTitle>
              <div className=' text-[14px] font-fsemibold mt-2 text-[rgba(0,0,0,0.40)]'>
                <div className="flex items-center justify-between bg-[rgba(85,123,241,0.02)] rounded-[8px] cursor-pointer min-w-[120px] relative py-3 px-4 ">
                  {label}
                  
                </div>
              </div>
            </ItemBox>
            <ItemBox width={180} height={100}>
              <ItemTitle>duration</ItemTitle>
              <div className='mt-2 font-fmedium'>
                <Select defaultValue={AIRDROP_DURATION[0]} options={AIRDROP_DURATION} onChange={handleDurationChange} />
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
                  <Select defaultValue={CHANNEL_LIST[0]} options={CHANNEL_LIST} />
                </div>
              </div>
              <div className='ml-[40px]'>
                <ItemTitle>Action</ItemTitle>
                <div className='mt-2 font-fmedium min-w-[146px]'>
                  <Select defaultValue={TWITTER_ACTION[0]} options={TWITTER_ACTION} onChange={handleChange} />
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
                <textarea className=' w-full h-full bg-[rgba(85,123,241,0)] outline-none leading-6 resize-none'
                  value={content}
                  onChange={() => {
                    
                  }}
                >
                
                </textarea>
              </div>
            </div>
          </ItemBox>
          
          <div className='h-[121px] bg-[rgba(123,120,255,0.06)] rounded-xl px-4 py-[18px] mt-5'>
            <div className=' font-fsemibold text-[#7B78FF] text-base leading-normal'>Airdrop assets would be locked in contract.</div>
            <div className=' text-[#7B78FF] text-[14px] mt-3 leading-[18px]'>When you try to create an airdrop, the associated token assets would be locked in contract, and you would receive same amount of correspondant “Air-” tokens, which are permitted to trade in airdrop pools.</div>
          </div>
        </div>
      </ItemWrap>
      <div className='flex justify-end mt-5'>
        <div className='w-[260px]'>
          <ButtonCancel 
            bgColor='#FAFAFA'
            onClick={e => {
              e.stopPropagation()
              router.push('/project/swap')
            }}
          >
            <span className=' btn-text'>Cancel</span>
          </ButtonCancel>
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
              onClick={async e => {
                e.stopPropagation()
                if (name.length <= 0) {
                  setErrorCode(-1)
                  return
                }
                await approve()
                setApprovedTokenA(true)
              }}
            >
              <div className='btn-text'>
                Approve {lockedCurrency?.symbol} (1/{approveB ? 2 : 1})
              </div>
              
            </ButtonSwap> : null
            
          }
          {
            approveB && unApproveList.length === 1 ? 
            <ButtonSwap 
              onClick={async e => {
                e.stopPropagation()
                if (name.length <= 0) {
                  setErrorCode(-1)
                  return
                }
                await approveLabel()
              }}
            >
              <div className='text-[rgba(123,120,255,0.9)] font-fsemibold text-[20px]'>
                Approve {outputAmount?.currency?.symbol} ({approvedTokenA ? 2 : 1}/{approveA || approvedTokenA ? 2 : 1})
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
                if (name.length <= 0) {
                  setErrorCode(-1)
                  return
                }
                
                handleCreateAirdrop(name, label, duration, 'Twitter', action, TWITTER_UNIT[action], content, lockedAmountAB.lockedAmountA, lockedAmountAB.lockedAmountB)
              }}
            >
              <TYPE.textGrad1 fontWeight={600} fontSize={20}>
                {
                  createStatus === 1 ? <LoadingX /> : 'Create'
                }
              </TYPE.textGrad1>
            </ButtonSwap>
        }
        </div>
      </div>
      
    </CreateBody>
  )
}
