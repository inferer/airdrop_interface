import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {  TYPE } from '../../theme'
import { ButtonCancel, ButtonSwap } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { CreateBody, ItemBox, ItemBox2, ItemCenter, ItemTitle, ItemWrap, TitleWrap, TokenInfo } from './styleds'
import LazyImage, { LazyImage2, LazyImage4 } from '../../components/LazyImage'
import Input from '../../components/TextInput/Input'
import TextInput from '../../components/TextInput'
import Select, { SelectChain } from './Select'
import { useCreateAirdrop, useCreateCallback, useCreateContractAirdrop } from '../../hooks/useAirdropSender'
import { ApprovalState } from '../../hooks/useApproveCallback'
import { Loading, LoadingContract, LoadingUint, LoadingX } from '../../components/Loader'
import { ETHER, Token } from '@uniswap/sdk'
import { AIRDROP_DURATION, CHANNEL_LIST, TWITTER_ACTION, TWITTER_UNIT, CONTRACT_ACTION, CHAIN_LIST } from '../../constants'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useRouter } from 'next/router'
import { othersContracts } from '../../constants/contractsLocal'
import ContractABI from './ContractABI'
import { formatInput, formatStringNumber, isAddress, verifyInput } from '../../utils'
import { useCreateContractABI } from '../../state/airdrop/hooks'
import SpreadingColor from './SpreadingColor'
import SpreadingChart from './SpreadingChart'

// ["airdrop 01","Social"]
// ["0x8797847c9d63D8Ed9C30B058F408d4257A33B76C","0x8797847c9d63D8Ed9C30B058F408d4257A33B76C"]
// ["100000000","1000000000000000000"]
// 176890023123


let globalApproveList: string[] = ['usdt', 'label']

const twitterContent = 'https://twitter.com/intent/like?tweet_id=1720373913576952121'
// const contractContent = othersContracts.projectContract.toLowerCase() + '.0xf4f3c8a4'
const contractContent = othersContracts.projectContract.toLowerCase() + '.comment'

export default function Create() {
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()
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

  const { createStatus, handleCreateAirdrop, handleEstimateGas } = useCreateAirdrop(args, lockedCurrency as Token ?? undefined)
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

  const currentChain = useMemo(() => {
    if(chainId) {
      return CHAIN_LIST.find(chain => chain.chainId === chainId)
    }
    return CHAIN_LIST[0]
  }, [chainId])

  const [chain, setChain] = useState(currentChain?.value || '')
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

  const [funName, setFunName] = useState('')
  const [parameter, setParameter] = useState<any>([])

  // useEffect(() => {
  //   if (contractABI[0]) {
  //     setFunName(contractABI[0].value)
  //     setParameter(contractABI[0].inputs)
  //   }
  // }, [contractABI])

  const handleParameterChange = useCallback((val, index) => {
    const status = verifyInput(val, parameter[index].type)

    parameter[index].value = val
    parameter[index].status = Number(status)
    setParameter([...parameter])
  }, [parameter, setParameter])

  const handleChangeFun = useCallback((data: any) => {
    setFunName(data.value)
    setParameter(data.inputs.map((item: any) => ({ ...item, status: 0 })))
  }, [setFunName, setParameter])

  const [ladningPage, setLandingPage] = useState('')
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

  const paremeterVerify = useMemo(() => {
    const filterList = parameter.filter((item: { status: number }) => item.status === 1)
    return funName && filterList.length === parameter.length
  }, [parameter, funName])

  const landingPageVerify = useMemo(() => {
    const ipUrlRegex = /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(\:\d+)?(\/\S*)?(\?\S*)?$/;
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9\-\_]+\.)+[a-zA-Z]{2,}(\/.*)?$/
    return urlRegex.test(ladningPage) || ipUrlRegex.test(ladningPage)
  }, [ladningPage])

  const [verifyUint, setVerifyUint] = useState(0)


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
    if (chain && contractAddress && contractABI.length > 0 && !funName) {
      tip = {
        num: 4,
        text: 'Please select the target function'
      }
    }
    if (chain && contractAddress && contractABI.length > 0 && funName && parameter.length > 0 && !paremeterVerify) {
      tip = {
        num: 5,
        text: 'Please fill in the required parameters'
      }
    }
    if (chain && contractAddress && contractABI.length > 0 && funName && paremeterVerify) {
      tip = {
        num: 6,
        text: 'Please fill in the required landing page'
      }
    }
    if (chain && contractAddress && contractABI.length > 0 && funName && paremeterVerify && landingPageVerify) {
      tip = {
        num: 7,
        text: 'Please check the calculated offer per unit'
      }
    }
    return tip

  }, [chain, contractAddress, contractABI, verifyStatus, isAddress, funName, parameter, paremeterVerify, landingPageVerify])

  useEffect(() => {
    return () => {
      handleUpdateContractABI([])
    }
  }, [])
  const functionRef = useRef<any>(null)
  useEffect(() => {
    if (chain && contractAddress && contractABI.length > 0) {
      if (functionRef.current) {
        setTimeout(() => {
          functionRef.current.scrollTop = 88
        }, 500)
      }
    }
  }, [chain, contractAddress, contractABI])

  const createDisabled = useMemo(() => {
    return !name || !chain || !isAddress(contractAddress) || (!funName && !contractABI[0]) || !paremeterVerify || !landingPageVerify
  }, [name, chain, contractAddress, funName, contractABI, paremeterVerify, landingPageVerify])

  useEffect(() => {
    // if (createDisabled) {
    //   setVerifyUint(1)
    //   setTimeout(() => {
    //     setVerifyUint(2)
    //   }, 1000)
    // }
  }, [createDisabled])
  const [gasUnit, setGasUnit] = useState(0)
  useEffect(() => {
    if (paremeterVerify && landingPageVerify && funName && contractAddress) {
      if (functionRef.current) {
        setTimeout(() => {
          functionRef.current.scrollTop = 888
        }, 300)
        setVerifyUint(1)
        setTimeout(() => {
          handleEstimateGas(contractAddress, funName, parameter)
            .then((unit) => {
              setVerifyUint(2)
              setGasUnit(unit)
              // setGasUnit(1)
            })
        }, 500)
      }
    } else {
      setVerifyUint(1)
    }
  }, [paremeterVerify, landingPageVerify, funName, contractAddress, parameter, handleEstimateGas])

  useEffect(() => {
    if (paremeterVerify && landingPageVerify && funName && contractAddress) {
      if (functionRef.current && verifyUint === 2) {
        setTimeout(() => {
          functionRef.current.scrollTop = 888
        }, 300)
      }
    }
  }, [paremeterVerify, landingPageVerify, funName, contractAddress, verifyUint])

  useEffect(() => {
    if (paremeterVerify && funName && contractAddress) {
      if (functionRef.current) {
        setTimeout(() => {
          functionRef.current.scrollTop = 888
        }, 300)
      }
    }
  }, [paremeterVerify, funName, contractAddress])

  return (
    <CreateBody className='create-body-root'>

      <TitleWrap>
        {/* <Link to="/swap">
          <div>
          <LazyImage className='icon-left cursor-pointer' src="/images/airdrop/arrow-left.svg" />
          </div>
        </Link> */}

        <div className=' text-[32px] font-fsemibold text-black leading-normal' style={{lineHeight: 'normal'}}>Create the airdrop</div>
      </TitleWrap>
      <div className='mt-6'>
        <div className='flex'>
          <ItemBox2
            error={nameError && name.length <= 0}
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
              {/* <Input value={''} placeholder='10' onUserInput={function (input: string): void {
                throw new Error('Function not implemented.')
              } } /> */}
              <div className=' text-[32px] font-fsemibold text-[rgba(0,0,0,0.40)]'>{formatStringNumber(lockedAmount)}</div>
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
                <Select defaultValue={AIRDROP_DURATION[0]} options={AIRDROP_DURATION} onChange={handleDurationChange} />
              </div>
            </ItemBox>
          </div>  
        </div>
        <div className='mt-5'>
          <ItemBox width={1120} height={385} style={{paddingRight: 0}}>
            
            <div className=' flex items-center h-full'>
              <div ref={functionRef} className={`h-[340px] overflow-auto scrollbar-container pr-4 function_ref ${contractABI.length > 0 ? 'pb-[0px]' : ''}`}>
                <div className='text-[16px] font-fbold text-[rgba(0,0,0,0.50)]'>Commodity info</div>
                <div className='flex w-full mt-[22px]'>
                  <div className='w-full'>
                    <ItemTitle style={{ fontSize: '12px' }}>NFT contract</ItemTitle>
                    <div className='mt-2 font-fmedium '>
                      <div className='w-[420px] rounded-xl border border-[rgba(85,123,241,0.10)] px-4 py-3 flex items-center h-[44px]'>
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
                </div>
                <div className='flex w-full'>
                  <div className='w-full mt-[26px]'>
                    <ItemTitle style={{ fontSize: '12px' }}>NFT id</ItemTitle>
                    <div className='mt-2 font-fmedium '>
                      <div className='w-[308px] rounded-xl border border-[rgba(85,123,241,0.10)] px-4 py-3 flex items-center h-[44px]'>
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
                  <LazyImage src='/images/demo2.png' className='w-[162px] h-[162px] rounded-[8px]' />
                </div>

              </div>
            </div>

          </ItemBox>


        </div>
        <div className='mt-6'>
          <ItemBox width={1120} height={1349} >
            <ItemTitle>Refer Action</ItemTitle>
            <div className='px-1'>
              <div className='text-[rgba(0,0,0,0.80)] text-[16px] font-fmedium my-[30px]'>Scoll the indicator to forcast the refer spreading outcome.</div>
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
                          50%
                        </div>
                      </div>
                      <div className='w-[50%] shrink-0'>
                        <div className='flex items-center text-[#3F4664] font-fbold'>
                          <LazyImage src='/images/airdrop/icon/icon2.svg' className='mr-[6px]' />
                          Estimate coverage
                        </div>
                        <div className='text-[rgba(63,70,100,0.60)] text-[16px] font-fnormal mt-4'>
                        30,000
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center mt-[37px]'>
                      <div className='w-[50%] shrink-0'>
                        <div className='flex items-center text-[#3F4664] font-fbold'>
                          <LazyImage src='/images/airdrop/icon/icon3.svg' className='mr-[6px]' />
                          Offer per unit
                        </div>
                        <div className='flex items-center mt-4'>
                          <div className='text-[rgba(63,70,100,0.60)] inline-flex text-[16px] font-fnormal px-2 py-[6px] h-[36px] items-center justify-center rounded-[4px] border border-[rgba(85,123,241,0.10)]'>
                            Air-Social
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
                        200%
                      </div>
                    </div>
                    <div className=' text-right'>
                      Compound income
                    </div>
                  </div>
                </div>
              </ItemBox>
              <ItemBox width={1080} height={982} style={{ marginTop: 20 }} >
                <div className=' flex justify-center text-[14px] font-fnormal'>Spreading chart</div>
                <SpreadingChart />
                <div className='w-full h-[428px] border border-[rgba(85,123,241,0.10) rounded-md mt-[30px]'>
                  <div className='flex items-center justify-between bg-[rgba(85,123,241,0.10)] w-full h-[48px] px-5' style={{borderRadius: '6px 6px 0px 0px'}}>
                    <div className=' flex items-center'>
                      <LazyImage src='/images/airdrop/icon/info.svg' />
                      <span className='text-[12px] font-fmedium ml-[6px]'>Compound income calculation</span>
                    </div>
                    <div>
                      <LazyImage src='/images/airdrop/icon/arrow-down.svg' />
                    </div>
                  </div>
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
                const _content = contractAddress.toLowerCase() + '.' + (funName ? funName : contractABI[0].value)
                console.log(chain, contractAddress, funName, gasUnit, _content)
                // return
                handleCreateAirdrop(name, label, duration, channel, action, String(gasUnit), _content, lockedAmountAB.lockedAmountA, lockedAmountAB.lockedAmountB, chain, parameter, ladningPage)
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
