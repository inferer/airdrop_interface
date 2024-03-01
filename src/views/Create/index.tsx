import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {  TYPE } from '../../theme'
import { ButtonCancel, ButtonSwap } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { CreateBody, ItemBox, ItemBox2, ItemCenter, ItemTitle, ItemWrap, TitleWrap, TokenInfo } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import Input from '../../components/TextInput/Input'
import TextInput from '../../components/TextInput'
import Select, { SelectChain } from './Select'
import { useCreateAirdrop, useCreateCallback, useCreateContractAirdrop } from '../../hooks/useAirdropSender'
import { ApprovalState } from '../../hooks/useApproveCallback'
import { Loading, LoadingContract, LoadingX } from '../../components/Loader'
import { ETHER, Token } from '@uniswap/sdk'
import { AIRDROP_DURATION, CHANNEL_LIST, TWITTER_ACTION, TWITTER_UNIT, CONTRACT_ACTION, CHAIN_LIST } from '../../constants'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useRouter } from 'next/router'
import { othersContracts } from '../../constants/contractsLocal'
import ContractABI from './ContractABI'
import { isAddress } from '../../utils'
import { useCreateContractABI } from '../../state/airdrop/hooks'

let globalApproveCount = 0

let globalApproveList: string[] = ['usdt', 'label']

const twitterContent = 'https://twitter.com/intent/like?tweet_id=1720373913576952121'
// const contractContent = othersContracts.projectContract.toLowerCase() + '.0xf4f3c8a4'
const contractContent = othersContracts.projectContract.toLowerCase() + '.comment'

export default function Create() {
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const [open, setOpen] = useState(false)

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState(false)
  const [errorCode, setErrorCode] = useState(1)
  const [approvedTokenA, setApprovedTokenA] = useState(false)

  const [content, setContent] = useState(twitterContent)

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
  const { handleUpdateContractABI } = useCreateContractAirdrop()
  const contractABI = useCreateContractABI()

  const label = useMemo(() => {
    return outputAmount?.currency?.symbol?.slice(4) || ''
  }, [outputAmount])

  const [channel, setChannel] = useState<string>('contract')
  const handleChangeChannel = (data: any) => {
    setChannel(data.value)
    if (data.value === 'twitter') {
      setAction('like')
      setContent(twitterContent)
    }
    if (data.value === 'contract') {
      setAction('function')
      setContent(contractContent)
    }
  }

  const [action, setAction] = useState<string>('function')
  const handleChange = (data: any) => {
    setAction(data.value)
  }
  
  const [duration, setDutation] = useState('1')
  const handleDurationChange = (data: any) => {
    setDutation(data.value)
  }

  const [chain, setChain] = useState('')
  const handleChangeChain = (data: any) => {
    setChain(data.value)
  }
  const [contractAddress, setContractAddress] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState(true)
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

  const [funName, setFunName] = useState(contractABI[0] ? contractABI[0].value : '')
  const handleChangeFun = useCallback((data: any) => {
    setFunName(data.value)
  }, [setFunName])

  useEffect(() => {
    if (contractABI.length > 0) {
      setVerifyStatus(true)
    }
  }, [contractABI])

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

  const actionList = useMemo(() => {
    if (channel === 'twitter') {
      return TWITTER_ACTION
    }
    return CONTRACT_ACTION
  }, [channel])

  const contractTip = useMemo(() => {
    let tip = {
      num: 1,
      text: 'Please select the target chain to continue'
    }
    if (chain && contractABI.length <= 0) {
      tip = {
        num: 2,
        text: 'Please input the contract address'
      }
    }
    if (chain && contractAddress && !verifyStatus && contractABI.length <= 0) {
      tip = {
        num: 3,
        text: 'Please fill contract ABI for verification'
      }
    }
    if (chain && contractAddress && contractABI.length > 0) {
      tip = {
        num: 4,
        text: 'Please select the target function and check the calculated offer per unit'
      }
    }
    return tip

  }, [chain, contractAddress, contractABI, verifyStatus, isAddress])

  useEffect(() => {
    return () => {
      handleUpdateContractABI([])
    }
  }, [])

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
          {/* <ItemBox width={664} height={244}>
            <div className='flex w-full'>
              <div>
                <ItemTitle>Channel</ItemTitle>
                <div className='mt-2 font-fmedium'>
                  <Select defaultValue={CHANNEL_LIST[0]} options={CHANNEL_LIST} onChange={handleChangeChannel} />
                </div>
              </div>
              <div className='ml-[40px]'>
                <ItemTitle>Action</ItemTitle>
                <div className='mt-2 font-fmedium min-w-[146px]'>
                  <Select defaultValue={actionList[0]} options={actionList} onChange={handleChange} />
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
                  <div className='flex items-center justify-between font-fsemibold text-[16px] py-3 px-4 bg-[rgba(85,123,241,0.02)] rounded-[8px]'>
                    <div>{TWITTER_UNIT[action]} x</div>
                    <div className='bg-[#F2F9F3] rounded flex items-center py-[1px] px-2 ml-[11px]'>
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
          </ItemBox> */}
          <ItemBox width={664} height={244}>
            <div className=' flex flex-col justify-between items-stretch h-full'>
              <div>
                <div className='flex w-full'>
                  <div className=' shrink-0'>
                    <ItemTitle>Chain</ItemTitle>
                    <div className='mt-2 font-fmedium'>
                      <SelectChain defaultValue={{}} options={CHAIN_LIST} onChange={handleChangeChain} />
                    </div>
                  </div>
                  {
                    chain && 
                    <div className='ml-[20px] w-full'>
                      <ItemTitle>Contract</ItemTitle>
                      <div className='mt-2 font-fmedium '>
                        <div className=' rounded-xl border border-[rgba(85,123,241,0.10)] px-4 py-3 flex items-center h-[44px]'>
                          <LazyImage src='/images/airdrop/contract_logo.svg' className=' shrink-0 mr-2' />
                          <TextInput  value={contractAddress} onUserInput={value => {
                            handleChangeAddress(value)
                          }} />
                          {
                            verifying && <LoadingContract /> 
                          }
                          {
                            !verifyStatus && contractABI.length <= 0 &&
                            <div className=' cursor-pointer'
                              onClick={e => {
                                e.stopPropagation()
                                setOpen(true)
                              }}
                            >
                              <LazyImage src='/images/airdrop/contract_code.svg' />
                            </div>
                          }
                          {
                            contractABI.length > 0 && 
                            <div className=' cursor-pointer'
                            >
                              <LazyImage src='/images/airdrop/contract_verify.svg' />
                            </div>
                          }
                          
                        </div>
                      </div>
                    </div>
                  }
                  
                </div>
                {
                  chain && contractAddress && contractABI.length > 0 &&
                  <>
                    <div className='flex w-full mt-4'>
                    <div className=' shrink-0 w-[300px]'>
                      <ItemTitle>Function</ItemTitle>
                      <div className='mt-2 font-fmedium'>
                        <SelectChain defaultValue={contractABI[0]} options={contractABI} onChange={handleChangeFun} />
                      </div>
                    </div>
                    <div className='mx-[51px]'>
                      <div className='mt-1'>
                        <LazyImage src='/images/airdrop/to.svg' />
                      </div>
                    </div>
                    <div className='shrink-0'>
                      <ItemTitle>Offer per unit</ItemTitle>
                      <div className='mt-2'>
                        <div className='flex items-center justify-between font-fsemibold text-[14px] h-[44px] py-3 px-4 bg-[rgba(85,123,241,0.02)] rounded-[8px]'>
                          <div>{TWITTER_UNIT[action]} x</div>
                          <div className='bg-[#F2F9F3] rounded flex items-center py-[1px] px-2 ml-[11px]'>
                            <CurrencyLogo currency={outputAmount?.currency} size={'20px'} />
                            <div className=' font-fmedium text-[#A1CEA8] ml-1'>
                              {outputAmount?.currency?.symbol}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                    <div className='mt-1 flex items-center text-[12px] text-[rgba(0,0,0,0.60)]'>
                      <LazyImage className='mr-1' src='/images/airdrop/info.svg' />
                      <div className=' '>Function must call ‘Inferer Airdrop Interface’. Check API document</div>
                      <LazyImage className='mx-1 cursor-pointer' src='/images/airdrop/link5.svg' />
                      <div> for more details.</div>
                    </div>
                  </>
                }
                
              </div>
              <div className='mt-[10px] text-[14px] text-[rgba(0,0,0,0.60)] flex items-center'>
                <div className='flex items-center text-[12px] justify-center w-[16px] h-[16px] bg-[rgba(0,0,0,0.06)] rounded-[4px]'>
                  { contractTip.num }
                </div>
                <div className='ml-2'>{ contractTip.text }</div>
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
              onClick={e => {
                e.stopPropagation()
                if (createStatus === 1) return
                if (name.length <= 0) {
                  setErrorCode(-1)
                  return
                }
                const _content = contractAddress.toLowerCase() + '.' + (funName ? funName : contractABI[0].value)
                console.log(chain, contractAddress, funName, TWITTER_UNIT[action], _content)
                // return
                handleCreateAirdrop(name, label, duration, channel, action, TWITTER_UNIT[action], _content, lockedAmountAB.lockedAmountA, lockedAmountAB.lockedAmountB)
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
