import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ButtonCancel, ButtonSwap } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { CreateBody, ItemBox, ItemBox2, ItemCenter, ItemTitle, ItemWrap, TitleWrap, TokenInfo } from './styleds'
import LazyImage, { LazyImage2, LazyImage4 } from '../../components/LazyImage'
import Input from '../../components/TextInput/Input'
import { useCreateAirdrop, useCreateCallback, useCreateContractAirdrop } from '../../hooks/useAirdropSender'
import { ApprovalState } from '../../hooks/useApproveCallback'
import { Loading, LoadingContract, LoadingUint, LoadingX } from '../../components/Loader'
import { ETHER, Token } from '@uniswap/sdk'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useRouter } from 'next/router'
import { formatInput, formatStringNumber, isAddress, verifyInput } from '../../utils'
import AwardList from './AwardList'
import TextInput from '../../components/TextInput'
import Content from './Content'


let globalApproveList: string[] = ['usdt', 'label']

export default function Create() {
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()
  const [open, setOpen] = useState(false)

  const [name, setName] = useState('')
  const [ladningPage, setLandingPage] = useState('')
  const [nameError, setNameError] = useState(false)
  const [errorCode, setErrorCode] = useState(1)
  const [approvedTokenA, setApprovedTokenA] = useState(false)

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

  const { createStatus, handleCreateAirdrop, handleEstimateGas } = useCreateAirdrop(args, lockedCurrency as Token ?? undefined)

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


  const [gasUnit, setGasUnit] = useState(0)

  const landingPageVerify = useMemo(() => {
    const ipUrlRegex = /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(\:\d+)?(\/\S*)?(\?\S*)?$/;
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9\-\_]+\.)+[a-zA-Z]{2,}(\/.*)?$/
    return urlRegex.test(ladningPage) || ipUrlRegex.test(ladningPage)
  }, [ladningPage])

  return (
    <CreateBody>
      <TitleWrap>
        <div className=' text-[32px] font-fsemibold text-black leading-normal' style={{lineHeight: 'normal'}}>Create the Campaign</div>
      </TitleWrap>
      <div className=' flex mt-6'>
        <ItemBox2
          style={{width: 653}}
          error={nameError && name.length <= 0}
          errorCode={errorCode}
        >
          <div className='content bg-white h-full'>
            <ItemTitle>campaign name</ItemTitle>
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
        <ItemBox style={{height: '100px', width: 240, marginLeft: 20}}>
          <ItemTitle>Type</ItemTitle>
          <div className=' text-[20px] font-fsemibold mt-2 leading-10'>Competition</div>
        </ItemBox>
      </div>
      <div className=' flex'>
        <ItemBox style={{ marginTop: 25, height: '101px', width: 353 }}>
          <ItemTitle>offer</ItemTitle>
          <div className='flex justify-between items-center mt-2'>
            <div className=' text-[32px] font-fsemibold text-[rgba(0,0,0,0.40)]'>{formatStringNumber(lockedAmount)}</div>
            <TokenInfo className='flex items-center shrink-0'>
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
        <ItemBox style={{ marginTop: 25, height: '101px', width: 353, marginLeft: 20 }}>
          <ItemTitle>receive</ItemTitle>
          <div className='flex justify-between items-center mt-2'>
            <div className=' text-[32px] font-fsemibold text-[rgba(0,0,0,0.40)]'>{formatStringNumber(outputAmount?.toSignificant(18))}</div>
            <TokenInfo className='flex items-center shrink-0'>
              <CurrencyLogo type='swap' currency={outputAmount?.currency || undefined} size={'24px'} />
              <div className='text-[20px] font-fsemibold ml-1'>{outputAmount?.currency?.symbol}</div>
            </TokenInfo>
          </div>
        </ItemBox>
        <ItemBox style={{ marginTop: 25, height: '101px', width: 353, marginLeft: 20 }}>
          <ItemTitle>Expire on (UTC)</ItemTitle>
          <div className=' text-[14px] font-fsemibold mt-2 text-[rgba(0,0,0,1)]'>
            <div className="flex items-center justify-between bg-[rgba(85,123,241,0.02)] rounded-[8px] cursor-pointer min-w-[120px] relative py-3 px-4 ">
              2024-04-16 00:00:00 (UTC)
            </div>
          </div>
        </ItemBox>
      </div>
      <AwardList />
      <Content />
      <ItemBox style={{height: '135px', width: '100%', marginTop: 24}}>
        <div className='shrink-0 '>
          <ItemTitle style={{color: '#000'}}>Landing Page</ItemTitle>
          <div className='mt-3 flex items-center'>
            <div className='w-[524px] shrink-0 rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[44px]'>
              <LazyImage src='/images/airdrop/landing.svg' className='mr-2' />

              <TextInput
                color='rgba(0,0,0,0.80)'
                fontSize='14px'
                value={ladningPage}
                onUserInput={value => {
                  setLandingPage(value)
                }}
              />
            </div>
            <div className=' shrink-0 ml-3'>
              <LazyImage2 src={landingPageVerify ? '/images/airdrop/status_2.svg' : '/images/airdrop/status_0.svg'} />
            </div>
          </div>
        </div>

      </ItemBox>
      <div className='flex justify-end mt-5'>
        <div className='w-[260px]'>
          <ButtonCancel
            bgColor='#FAFAFA'
            onClick={e => {
              e.stopPropagation()
              router.push('/project/campaign')
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
              <div className='btn-text'>
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
              disabled={false}
              onClick={e => {
                e.stopPropagation()
                if (createStatus === 1) return
                // return
                // handleCreateAirdrop(name, label, duration, channel, action, String(gasUnit), _content, lockedAmountAB.lockedAmountA, lockedAmountAB.lockedAmountB, chain, parameter, ladningPage)
              }}
            >
              <div className='btn-text'>
                {
                  createStatus === 1 ? <LoadingX /> : 'Create'
                }
              </div>
            </ButtonSwap>
        }
        </div>
      </div>
    </CreateBody>
  )
}
