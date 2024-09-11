import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {  TYPE } from '../../theme'
import { ButtonCancel, ButtonSwap } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { CreateBody, ItemBox, ItemBox2, ItemCenter, ItemTitle, ItemWrap, TitleWrap, TokenInfo } from './styleds'
import LazyImage, { LazyImage2, LazyImage4 } from '../../components/LazyImage'
import Input from '../../components/TextInput/Input'
import TextInput from '../../components/TextInput'
import Select, { SelectChain } from './Select'
import { ApprovalState } from '../../hooks/useApproveCallback'
import { Loading, LoadingContract, LoadingUint, LoadingX } from '../../components/Loader'
import { ETHER, Token } from '@uniswap/sdk'
import { AIRDROP_DURATION, AIRDROPREFER_TYPE } from '../../constants'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useRouter } from 'next/router'
import ContractABI from './ContractABI'
import { formatInput, formatStringNumber, isAddress, verifyInput } from '../../utils'
import { useCreateAirdropRefer, useCreateCallback } from '../../hooks/useAirdropSenderRefer'
import SpreadingChart from './SpreadingChart'

let globalApproveList: string[] = ['usdt', 'label']

export default function Create() {
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()
  const [open, setOpen] = useState(false)

  const [name, setName] = useState('')
  const [errorCode, setErrorCode] = useState(1)
  const [approvedTokenA, setApprovedTokenA] = useState(false)

  const {
    args,
    lockedAmount,
    lockedAmountAB,
    lockedCurrency,
    outputAmount,
    approvalState,
    approve,
    approvalStateLabel,
    approveLabel,
    approvalStateAir,
    approveAir
  } = useCreateCallback(undefined, undefined, undefined, null)
  
  const { createStatus, handleCreateAirdrop, handleVerifyNFTOwner } = useCreateAirdropRefer(args, lockedCurrency as Token ?? undefined)
  const label = useMemo(() => {
    return outputAmount?.currency?.symbol?.slice(4) || ''
  }, [outputAmount])

  const [duration, setDutation] = useState('1')
  const handleDurationChange = (data: any) => {
    setDutation(data.value)
  }
  const [type, setType] = useState('Commodity')
  const handleTypeChange = (data: any) => {
    setType(data.value)
  }

  const [verifying, setVerifying] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState(true)

  const [contractAddress, setContractAddress] = useState('')
  const handleChangeAddress = useCallback(value => {
    if (verifying) return
    setContractAddress(value)
    if (isAddress(value)) {
      setVerifying(true)
      setTimeout(() => {
        setVerifying(false)
        setVerifyStatus(false)
      }, 1500)
    }
  }, [verifying, setVerifying])

  const timer = useRef<any>(null)
  const [verifyingNFTId, setVerifyingNFTId] = useState(false)
  const [verifyNFTIdStatus, setVerifyNFTIdStatus] = useState(1)
  const [nftURI, setNFTURI] = useState({
    "name": "",
    "description": "",
    "image": "",
    "strength": 20
  })
  const [nftId, setNftId] = useState('')
  const handleChangeNFTId = useCallback((value) => {
    setNftId(value)
    if (!value) return
    if (!contractAddress) return
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      setVerifyingNFTId(true)
      handleVerifyNFTOwner(contractAddress, value)
        .then((res) => {
          setVerifyingNFTId(false)
          setVerifyNFTIdStatus(res ? 2 : 0)
          setNFTURI(res || {"name": "",
          "description": "",
          "image": "",
          "strength": 20})
        })
    }, 800)
  }, [handleVerifyNFTOwner, contractAddress])

  const [ladningPage, setLandingPage] = useState('')

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

  const landingPageVerify = useMemo(() => {
    const ipUrlRegex = /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(\:\d+)?(\/\S*)?(\?\S*)?$/;
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9\-\_]+\.)+[a-zA-Z]{2,}(\/.*)?$/
    return urlRegex.test(ladningPage) || ipUrlRegex.test(ladningPage)
  }, [ladningPage])

  const createDisabled = useMemo(() => {
    return !name || !isAddress(contractAddress) || !landingPageVerify || !nftURI.name
  }, [name, contractAddress, landingPageVerify, nftURI])

  const [currentPer, setCurrentPer] = useState(0.5)

  const onSpreadingChartChange = useCallback((per: number) => {
    setCurrentPer(1 - per + 0.25)
  }, [])

  const coverage = useMemo(() => {
    return Math.ceil(Number(lockedAmount) / currentPer)
  }, [currentPer, lockedAmount])

  const incomePer = useMemo(() => {
    let _index = 5;
    if (currentPer >= 1) {
      _index = 5
    }
    let _amount = 0;
    while(_index > 0) {
      _amount += Math.pow(currentPer, _index)
      _index--;
    }
    return 100 + Math.floor(_amount * 100)
  }, [currentPer])

  const [expend, setExpend] = useState(true)

  return (
    <CreateBody className='create-body-root'>

      <TitleWrap>
        <div className=' text-[32px] font-fsemibold text-black leading-normal' style={{lineHeight: 'normal'}}>Create the airdrop</div>
      </TitleWrap>
      <div className='mt-6'>
        <div className='flex'>
          <ItemBox2
            error={name.length <= 0}
            errorCode={errorCode}
            style={{width: 555 }}
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
          <ItemBox style={{ width: 531,  height: '100px', marginLeft: 20 }}>
            <ItemTitle>offer</ItemTitle>
            <div className='flex justify-between items-center mt-2'>
              <div className=' text-[32px] font-fsemibold text-[rgba(0,0,0,0.40)]'>{formatStringNumber(lockedAmount)}</div>
              <TokenInfo className='flex items-center shrink-0'>
                <CurrencyLogo type='swap' currency={lockedCurrency || undefined} size={'24px'} />
                <div className='text-[20px] font-fsemibold ml-1'>{lockedCurrency?.symbol}</div>
              </TokenInfo>
            </div>


          </ItemBox>
        </div>
        <div className='flex mt-5'>
          <div className='flex items-center w-[555px]'>
            <ItemBox width={180} height={100}>
              <ItemTitle>pool</ItemTitle>
                <div className=' text-[14px] font-fsemibold mt-2 text-[rgba(0,0,0,0.40)]'>
                  <div className="flex items-center justify-between bg-[rgba(85,123,241,0.02)] rounded-[8px] cursor-pointer min-w-[120px] relative py-3 px-4 ">
                    {label}

                  </div>
                </div>
              </ItemBox>
              <ItemBox width={180} height={100} style={{marginLeft: 20}}>
                <ItemTitle>duration</ItemTitle>
                <div className='mt-2 font-fmedium'>
                  <Select defaultValue={AIRDROP_DURATION[0]} options={AIRDROP_DURATION} onChange={handleDurationChange} />
                </div>
              </ItemBox>
          </div>
          <div className='w-[531px] ml-5'>
            <ItemBox width={180} height={100}>
              <ItemTitle>Type</ItemTitle>
              <div className='mt-2 font-fmedium'>
                <Select defaultValue={AIRDROPREFER_TYPE[0]} options={AIRDROPREFER_TYPE} onChange={handleTypeChange} />
              </div>
            </ItemBox>
          </div>  
        </div>
        <div className='mt-5'>
          <ItemBox width={1120} height={385} style={{paddingRight: 0}}>
            
            <div className=' flex items-center h-full'>
              <div className={`h-[340px] overflow-auto scrollbar-container pr-4 function_ref`}>
                <div className='text-[16px] font-fbold text-[rgba(0,0,0,0.50)]'>Commodity info</div>
                <div className='flex w-full mt-[22px]'>
                  <div className='w-full'>
                    <ItemTitle style={{ fontSize: '12px' }}>NFT contract</ItemTitle>
                    <div className='mt-2 font-fmedium '>
                      <div className='w-[430px] rounded-xl border border-[rgba(85,123,241,0.10)] px-4 py-3 flex items-center h-[44px]'>
                        <LazyImage src='/images/airdrop/contract_logo.svg' className=' shrink-0 mr-2' />
                        <TextInput  value={contractAddress} onUserInput={value => {
                          handleChangeAddress(value)
                        }} />
                        {
                          verifying && <LoadingContract />
                        }
                        
                        {
                          !verifyStatus && 
                          <div className=' cursor-pointer'
                          >
                            <LazyImage src='/images/airdrop/contract_verify.svg' />
                          </div>
                        }

                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex w-full'>
                  <div className='w-full mt-[26px]'>
                    <ItemTitle style={{ fontSize: '12px' }}>NFT id</ItemTitle>
                    <div className='mt-2 font-fmedium '>
                      <div className='w-[308px] rounded-xl border border-[rgba(85,123,241,0.10)] px-4 py-3 flex items-center h-[44px]'>
                        <TextInput  value={nftId} onUserInput={value => {
                          handleChangeNFTId(value)
                        }} />
                        {
                          verifyingNFTId && <LoadingContract />
                        }
                        
                        {
                          (verifyNFTIdStatus === 2) && nftId &&
                          <div className=' cursor-pointer'
                          >
                            <LazyImage src='/images/airdrop/contract_verify.svg' />
                          </div>
                        }
                        {
                          verifyNFTIdStatus === 0 &&
                          <div className=' font-dnormal text-[14px] text-[rgba(248,138,138,0.6)] shrink-0 flex items-center'>
                            NFT not available
                            <div className=' cursor-pointer'
                              onClick={e => {
                                e.stopPropagation()
                                setNftId('')
                                setVerifyNFTIdStatus(1)
                              }}
                            >
                              <LazyImage src='/images/airdrop/close_red.svg' className='ml-2 cursor-pointer'
                              />
                            </div>
                            
                          </div>
                        }

                      </div>
                    </div>
                  </div>
                </div>
                <div className='shrink-0 mt-[26px]'>
                  <ItemTitle style={{ fontSize: '12px' }}>Landing Page</ItemTitle>
                  <div className='mt-3 flex items-center'>
                    <div className='w-[567px] shrink-0 rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[44px]'>
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
              </div>
              <div className='w-[1px] h-[86px] bg-[rgba(63,70,100,0.10)] ml-[184px]'></div>
              <div className='mt-[10px] text-[14px] text-[rgba(0,0,0,0.60)] ml-[120px]'>
                <div className='text-[16px] font-fbold text-[rgba(0,0,0,0.50)]'>Commodity Preview</div>
                <div className=' mt-6'>
                  {
                    nftURI.image 
                      ? <LazyImage src={nftURI.image} className='w-[162px] h-[162px] rounded-[8px]' />
                      : <div className='w-[162px] h-[162px] rounded-[8px]'></div>
                  }
                  
                </div>

              </div>
            </div>

          </ItemBox>


        </div>
        <div className='mt-6'>
          <ItemBox width={1120} height={1349 }  style={{height: 'auto'}}>
            <ItemTitle>Refer Action</ItemTitle>
            <div className='px-1'>
              <div className='text-[rgba(0,0,0,0.80)] text-[16px] font-fmedium my-[30px]'>Scroll the indicator to forcast the refer spreading outcome.</div>
              <ItemBox width={1080} height={207} >
                <div className='flex items-center'>
                  <div className='w-full'>
                    <div className='flex items-center'>
                      <div className='w-[50%] shrink-0'>
                        <div className='flex items-center text-[#3F4664] font-fbold'>
                          <LazyImage src='/images/airdrop/icon/icon1.svg' className='mr-[6px]' />
                          Refer Percentage
                        </div>
                        <div className='text-[rgba(63,70,100,0.60)] text-[16px] font-fnormal mt-4'>
                          {(currentPer * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className='w-[50%] shrink-0'>
                        <div className='flex items-center text-[#3F4664] font-fbold'>
                          <LazyImage src='/images/airdrop/icon/icon2.svg' className='mr-[6px]' />
                          Estimate coverage
                        </div>
                        <div className='text-[rgba(63,70,100,0.60)] text-[16px] font-fnormal mt-4'>
                          {coverage}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center mt-[37px]'>
                      <div className='w-[50%] shrink-0'>
                        <div className='flex items-center text-[#3F4664] font-fbold'>
                          <LazyImage src='/images/airdrop/icon/icon3.svg' className='mr-[6px]' />
                          Offer per unit
                        </div>
                        {/* <div className=' flex items-center'>
                    <CurrencyLogo currency={outputAmount?.currency} size={'14px'} />
                    <span className='mx-1'>{lockedAmountAB.lockedAmountBShow}</span>
                    {outputAmount?.currency?.symbol}
                  </div> */}
                        <div className='flex items-center mt-4'>
                          <div className='text-[rgba(63,70,100,0.60)] inline-flex text-[16px] font-fnormal px-2 py-[6px] h-[36px] items-center justify-center rounded-[4px] border border-[rgba(85,123,241,0.10)]'>
                            <CurrencyLogo currency={outputAmount?.currency} size={'14px'} />
                            <span className='ml-1'>{outputAmount?.currency?.symbol}</span>
                            
                          </div>
                          <div className='text-[rgba(63,70,100,0.60)] text-base ml-2'>
                            X 1
                          </div>
                        </div>
                      </div>
                      <div className='w-[50%] shrink-0'>
                        <div className='flex items-center text-[#3F4664] font-fbold'>
                          <LazyImage src='/images/airdrop/icon/icon4.svg' className='mr-[6px]' />
                          Contract
                        </div>
                        <div className='text-[rgba(63,70,100,0.60)] inline-flex text-[16px] font-fnormal mt-4 px-2 py-[6px] h-[36px] items-center justify-center rounded-[4px] border border-[rgba(85,123,241,0.10)] cursor-pointer'>
                          Code Preview
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=' shrink-0 w-[370px]'>
                    <div className=' flex items-center justify-between'>
                      <div className='w-[1px] h-[86px] bg-[rgba(63,70,100,0.10)] '></div>
                      <div className='text-[102px] font-fbold primary-text leading-[110%]'>
                        {incomePer}%
                      </div>
                    </div>
                    <div className=' text-right'>
                      Compound income
                    </div>
                  </div>
                </div>
              </ItemBox>
              <ItemBox width={1080} height={982} style={{ marginTop: 20, height: 'auto' }} >
                <div className=' flex justify-center text-[14px] font-fnormal'>Spreading chart</div>
                <SpreadingChart onChange={onSpreadingChartChange} />
                <div className='w-full h-auto border border-[rgba(85,123,241,0.10) rounded-md mt-[30px]'>
                  <div
                    onClick={e => {
                      e.stopPropagation()
                      setExpend(!expend)
                    }} 
                    className=' cursor-pointer flex items-center justify-between bg-[rgba(85,123,241,0.10)] w-full h-[48px] px-5' style={{borderRadius: '6px 6px 0px 0px'}}>
                    <div className=' flex items-center'>
                      <LazyImage src='/images/airdrop/icon/info.svg' />
                      <span className='text-[12px] font-fmedium ml-[6px]'>Compound income calculation</span>
                    </div>
                    <div
                      className=' cursor-pointer'
                      
                    >
                      <LazyImage src='/images/airdrop/icon/arrow-down.svg' className={`transition-all ${expend ? ' -rotate-180' : ''}`} />
                    </div>
                  </div>
                   {
                    expend && 
                    <div className='p-5 text-[12px] font-fnormal'>
                      <div>Compound income is calculated exponentially based on 1 Air-Social. As the refer percentage changes, compound benefits would grow massively. Assume the compound income is CI, the refer precentage is R, the offer per unit is O, n is the number of people who refers, then the formula would be such as:</div>
                      <div className='mt-[39px] mb-[33px]'>
                        <LazyImage src='/images/airdrop/icon/ci1.png' className='w-[462px]' />
                      </div>
                      <div>For example, the refer percentage is 0.75, the offer per unit is 1 x Air-Social token, and we maximize the refer process, then we could have the compound income equal to 3 x Air-Social token.</div>
                      <div className='mt-[20px] mb-[32px]'>
                        <LazyImage src='/images/airdrop/icon/ci2.png' className='w-[746px]' />
                      </div>
                      <div>
                      With thid refer design mechanism deployed in contract, there would be always expotential benefits when peple refer further and acquire lots of fun.
                      </div>
                    </div>
                   }
                  
                </div>
                
              </ItemBox>
            </div>
          </ItemBox>
        </div>
      </div>
      <div className='flex justify-end mt-5'>
        <div className='w-[260px]'>
          <ButtonCancel
            bgColor='#FAFAFA'
            onClick={e => {
              e.stopPropagation()
              router.push('/project/create')
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
              disabled={createDisabled}
              onClick={e => {
                e.stopPropagation()
                if (createStatus === 1) return
                if (createDisabled) return
                // return
                handleCreateAirdrop(name, label, type, contractAddress, nftId, ladningPage, lockedAmountAB.lockedAmountA, lockedAmountAB.lockedAmountB, duration)
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
      <ContractABI isOpen={open} onClose={() => {
        setOpen(false)
      }} />
    </CreateBody>
  )
}
