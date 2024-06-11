import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ButtonCancel, ButtonSwap } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { CreateBody, ItemBox, ItemBox2, ItemCenter, ItemTitle, ItemWrap, TitleWrap, TokenInfo } from './styleds'
import LazyImage, { LazyImage2, LazyImage4 } from '../../components/LazyImage'
import Input from '../../components/TextInput/Input'
import InputNumber from "../../components/NumericalInput";
import { useCreateCallback } from '../../hooks/useCampaignSender'
import { ApprovalState } from '../../hooks/useApproveCallback'
import { Loading, LoadingContract, LoadingUint, LoadingX } from '../../components/Loader'
import { ETHER, Token } from '@uniswap/sdk'
import CurrencyLogo from '../../components/CurrencyLogo'
import { useRouter } from 'next/router'
import { formatInput, formatStringNumber, isAddress, verifyInput } from '../../utils'
import AwardList from './AwardList'
import TextInput from '../../components/TextInput'
import Content from './Content'
import { useCampaignSender } from '../../hooks/useCampaignSender'
import Select from '../Create/Select'
import { CAMPAIGN_DURATION, CHAIN_LIST } from '../../constants'
import { useIry } from '../../hooks/useIry'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { useDerivedSwapInfo, useSwapActionHandlers } from '../../state/swap/hooks'
import { Field } from '../../state/swap/actions'
import { useCurrencyBalanceUSDT } from '../../state/wallet/hooks'
import { useInputTokens } from '../../hooks/Tokens'
import { useAirCampaignAmount } from '../../hooks/useAirdropAssetTreasury'
import BN from 'bignumber.js'
import NumberAdd from '../../components/NumberAdd'

let globalApproveList: string[] = ['usdt', 'label']

export const InputWrap = ({ children }: any) => {
  return (
    <div className='w-[67px] h-[40px] py-3 pl-2 pr-2 rounded-lg border border-[rgba(85,123,241,0.1)] flex items-center'>
      { children }
    </div>
  )
}

export default function Create() {
  const router = useRouter()
  const { account, chainId } = useActiveWeb3React()

  const [name, setName] = useState('')
  const [landingPage, setLandingPage] = useState('')
  const [nameError, setNameError] = useState(false)
  const [errorCode, setErrorCode] = useState(1)
  const [approvedTokenA, setApprovedTokenA] = useState(false)
  const [awardData, setAwardData] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const {
    currencies,
    args,
    lockedAmount,
    lockedAmountAB,
    lockedCurrency,
    lockedCurrencyAir,
    lockedCurrencyAirCampaign,
    lockedCurrencyAmount,
    outputAmount,
    approvalState,
    approve,
    approvalStateLabel,
    approveLabel,
    approvalStateAir,
    approveAir
  } = useCreateCallback(undefined, undefined, undefined, null)
  const { onCurrencySelection } = useSwapActionHandlers()
  // @ts-ignore
  const selectedCurrencyBalanceUSDT = useCurrencyBalanceUSDT(account ?? undefined, currencies[Field.INPUT] && currencies[Field.INPUT].address, true)
  const airCampaignAmount = useAirCampaignAmount()
  const { uploadStatus, handleUploadStr } = useIry()
  const { createStatus, handleCreateCampaign } = useCampaignSender(args, lockedCurrency as Token ?? undefined)

  const [approveLoading, setApproveLoading] = useState(true)
  const [unApproveList, setUnApproveList] = useState<string[]>(globalApproveList)
  const inputTokens = useInputTokens()
  useEffect(() => {
    if (inputTokens[0]) {
      onCurrencySelection(Field.INPUT, inputTokens[0])
    }
  }, [inputTokens, onCurrencySelection])

  useEffect(() => {
    if (approvalState !== ApprovalState.UNKNOWN) {
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
    // if (approvalStateLabel === ApprovalState.APPROVED) {
    //   const _index = unApproveList.findIndex(label => label === 'label')
    //   if (_index > -1) {
    //     const newList = [...unApproveList]
    //     newList.splice(_index, 1)
    //     setUnApproveList(newList)
    //   }
    // }
  }, [approvalState, unApproveList])

  const approveA = useMemo(() => {
    return approvalState === ApprovalState.NOT_APPROVED && (lockedCurrency && lockedCurrency !== ETHER )
  }, [lockedCurrency, approvalState])

  const approveB = useMemo(() => {
    return approvalStateLabel === ApprovalState.NOT_APPROVED && !!outputAmount
  }, [outputAmount, approvalStateLabel])


  const landingPageVerify = useMemo(() => {
    const ipUrlRegex = /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(\:\d+)?(\/\S*)?(\?\S*)?$/;
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9\-\_]+\.)+[a-zA-Z]{2,}(\/.*)?$/
    return urlRegex.test(landingPage) || ipUrlRegex.test(landingPage)
  }, [landingPage])

  const [duration, setDutation] = useState('1')
  const handleDurationChange = (data: any) => {
    setDutation(data.value)
  }
  const label = useMemo(() => {
    return outputAmount?.currency?.symbol?.slice(4) || ''
  }, [outputAmount])

  const currentChain = useMemo(() => {
    if(chainId) {
      return CHAIN_LIST.find(chain => chain.chainId === chainId)
    }
    return CHAIN_LIST[0]
  }, [chainId])
  const channel = 'campaign'
  const action = 'competition'
  const [createContent, setCreateContent] = useState('') 
  const [arwId, setArwId] = useState('')


  const handleInputSelect = useCallback(
    inputCurrency => {
      onCurrencySelection(Field.INPUT, inputCurrency)
      // 
    },
    [onCurrencySelection, currencies]
  )
  
  const [offerAmount, setOfferAmount] = useState('')
  const [ariCampaignAmount, setAirCampaignAmount] = useState('')

  const [applyDeadline, setApplyDeadline] = useState(['', '', '', ''])
  const [voteDeadline, setVoteDeadline] = useState(['', '', '', ''])

  useEffect(() => {
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    console.log(month, day, hour)
    setApplyDeadline([String(month), String(day), String(hour), '1'])
    setVoteDeadline([String(month), String(day), String(hour), '1'])
  }, [])

  const handleDeadlineInput = useCallback((value, index, type) => {
    if (type === 'apply') {
      const tempList = [...applyDeadline]
      tempList[index] = value
      setApplyDeadline([...tempList])
    }
    if (type === 'vote') {
      const tempList = [...voteDeadline]
      tempList[index] = value
      setVoteDeadline([...tempList])
    }
  }, [applyDeadline, voteDeadline])

  const applyDuration = useMemo(() => {
    return Math.floor(new Date(
                        new Date().getFullYear(), 
                        Number(applyDeadline[0]) - 1,
                        Number(applyDeadline[1]),
                        Number(applyDeadline[2]),
                        Number(applyDeadline[3]),
                        0
                      ).getTime() / 1000)
  }, [applyDeadline])

  const voteDuration = useMemo(() => {
    return Math.floor(new Date(
                        new Date().getFullYear(), 
                        Number(voteDeadline[0]) - 1,
                        Number(voteDeadline[1]),
                        Number(voteDeadline[2]),
                        Number(voteDeadline[3]),
                        0
                      ).getTime() / 1000)
  }, [voteDeadline])

  const disabled = useMemo(() => {
    const applyVerify = applyDeadline[0] !== '' && applyDeadline[1] !== '' && applyDeadline[2] !== '' && applyDeadline[3] !== ''
    const voteVerify = voteDeadline[0] !== '' && voteDeadline[1] !== '' && voteDeadline[2] !== '' && voteDeadline[3] !== ''
    return !name || !createContent || !landingPageVerify || !applyVerify || !voteVerify
  }, [name, createContent, landingPageVerify, offerAmount, ariCampaignAmount, applyDeadline, voteDeadline])

  const InputNumberClass = {
    width: 32, height: '17px', marginTop: 0, paddingLeft: '4px', fontSize: 14, color: 'rgba(0, 0, 0, 1)'
  }

  return (
    <CreateBody>
      <TitleWrap>
        <div className=' text-[32px] font-fsemibold text-black leading-normal' style={{lineHeight: 'normal'}}>Create the Campaign</div>
      </TitleWrap>
      <div className=' flex mt-6'>
        <ItemBox2
          style={{width: 553}}
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
        <ItemBox style={{height: '100px', width: 240, marginLeft: 15}}>
          <ItemTitle>Type</ItemTitle>
          <div className=' text-[20px] font-fsemibold mt-2 leading-10'>Competition</div>
        </ItemBox>
        <ItemBox style={{ height: '101px', width: 300, marginLeft: 15 }}>
          <ItemTitle>offer</ItemTitle>
          <div className='flex justify-between items-center mt-2'
          >
            <div className=' text-[32px] font-fsemibold text-[rgba(0,0,0,0.40)]'>
              <InputNumber style={{
                width: 110, height: 40, marginTop: 0, padding: '0', fontSize: 32
              }} 
                className=" rounded-lg" 
                placeholder='0'
                value={offerAmount} 
                onUserInput={ value => {
                  setOfferAmount(value)
                }} />
            </div>
            {
              lockedCurrency ? 
                <TokenInfo className='flex items-center justify-between shrink-0 min-w-[146px] cursor-pointer'
                onClick={() => {
                  setModalOpen(true)
                }}
              >
                <div className='flex items-center '>
                  <CurrencyLogo type='payInputCreate' currency={selectedCurrencyBalanceUSDT?.currency || undefined} size={'24px'} />
                  <div className='text-[20px] font-fsemibold ml-2'>{selectedCurrencyBalanceUSDT?.currency?.symbol}</div>
                </div>
                
                <LazyImage src='/images/campaign/down.svg' className='ml-2' />
              </TokenInfo> :
              <div
                className=' cursor-pointer'
                onClick={() => {
                  setModalOpen(true)
                }}
              >SelectToken</div>
            }
            
          </div>
          
        </ItemBox>
      </div>
      <div className=' flex'>
        <ItemBox style={{ marginTop: 25, height: '101px', width: 310 }}>
          <ItemTitle>receive</ItemTitle>
          <div className='flex justify-between items-center mt-2'>
            <div className=' text-[32px] font-fsemibold text-[rgba(0,0,0,0.40)]'>
              {/* <InputNumber style={{
                width: 80, height: 40, marginTop: 0, padding: '0', fontSize: 32
              }} 
                className=" rounded-lg" 
                placeholder='0'
                value={ariCampaignAmount} 
                onUserInput={ value => {
                  setAirCampaignAmount(value)
                }} /> */}
                {airCampaignAmount}
            </div>
            <TokenInfo className='flex items-center shrink-0'>
              <CurrencyLogo type='create' currency={lockedCurrencyAirCampaign} size={'24px'} />
              <div className='text-[20px] font-fsemibold ml-1'>{lockedCurrencyAirCampaign?.symbol}</div>
            </TokenInfo>
          </div>
        </ItemBox>
        <ItemBox style={{ marginTop: 25, height: '101px', width: 399, marginLeft: 15 }}>
          <ItemTitle>apply deadline (utc)</ItemTitle>
          <div className='flex items-center mt-3'>
            <InputWrap>
              <InputNumber style={InputNumberClass} 
                className=" rounded-lg" 
                placeholder='0'
                value={applyDeadline[0]} 
                onUserInput={ value => {
                  if ((value.length <= 1 && Number(value) === 0) || /^([1-9]|1[0-2])$/.test(value)) {
                    handleDeadlineInput(value, 0, 'apply')
                  }
                  
                }} />
              <NumberAdd 
                onPlus={() => {
                  if (/^([1-9]|1[0-2])$/.test(String(Number(applyDeadline[0]) + 1))) {
                    handleDeadlineInput(Number(applyDeadline[0]) + 1, 0, 'apply')
                  }
                }}
                onMinus={() => {
                  if (/^([1-9]|1[0-2])$/.test(String(Number(applyDeadline[0]) - 1))) {
                    handleDeadlineInput(Number(applyDeadline[0]) - 1, 0, 'apply')
                  }
                }}
              />
            </InputWrap>
            <div className='px-2 text-[14px] font-fsemibold'>
              M
            </div>
            <InputWrap>
              <InputNumber style={InputNumberClass} 
                className=" rounded-lg" 
                placeholder='0'
                value={applyDeadline[1]} 
                onUserInput={ value => {
                  if ((value.length <= 1 && Number(value) === 0) || /^(?:0?[1-9]|[12]\d|3[01])$/.test(value)) {
                    handleDeadlineInput(value, 1, 'apply')
                  }
                  
                }} />
              <NumberAdd 
                onPlus={() => {
                  if (/^(?:0?[1-9]|[12]\d|3[01])$/.test(String(Number(applyDeadline[1]) + 1))) {
                    handleDeadlineInput(Number(applyDeadline[1]) + 1, 1, 'apply')
                  }
                }}
                onMinus={() => {
                  if (/^(?:0?[1-9]|[12]\d|3[01])$/.test(String(Number(applyDeadline[1]) - 1))) {
                    handleDeadlineInput(Number(applyDeadline[1]) - 1, 1, 'apply')
                  }
                }}
              />
            </InputWrap>
            <div className='px-2 text-[14px] font-fsemibold'>
              D
            </div>
            <InputWrap>
              <InputNumber style={InputNumberClass} 
                className=" rounded-lg" 
                placeholder='0'
                value={applyDeadline[2]} 
                onUserInput={ value => {
                  if ((value.length <= 1 && Number(value) === 0) || /^([01]?[0-9]|2[0-3])$/.test(value)) {
                    handleDeadlineInput(value, 2, 'apply')
                  }
                  
                }} />
              <NumberAdd 
                onPlus={() => {
                  if (/^([01]?[0-9]|2[0-3])$/.test(String(Number(applyDeadline[2]) + 1))) {
                    handleDeadlineInput(Number(applyDeadline[2]) + 1, 2, 'apply')
                  }
                }}
                onMinus={() => {
                  if (/^([01]?[0-9]|2[0-3])$/.test(String(Number(applyDeadline[2]) - 1))) {
                    handleDeadlineInput(Number(applyDeadline[2]) - 1, 2, 'apply')
                  }
                }}
              />
            </InputWrap>
            <div className='px-2 text-[14px] font-fsemibold'>
              h
            </div>
            <InputWrap>
              <InputNumber style={InputNumberClass} 
                className=" rounded-lg" 
                placeholder='0'
                value={applyDeadline[3]} 
                onUserInput={ value => {
                  if ((value.length <= 1 && Number(value) === 0) || /^([0-5]\d|[0-9])$/.test(value)) {
                    handleDeadlineInput(value, 3, 'apply')
                  }
                }} />
              <NumberAdd 
                onPlus={() => {
                  if (/^([0-5]\d|[0-9])$/.test(String(Number(applyDeadline[3]) + 1))) {
                    handleDeadlineInput(Number(applyDeadline[3]) + 1, 3, 'apply')
                  }
                }}
                onMinus={() => {
                  if (/^([0-5]\d|[0-9])$/.test(String(Number(applyDeadline[3]) - 1))) {
                    handleDeadlineInput(Number(applyDeadline[3]) - 1, 3, 'apply')
                  }
                }}
              />
            </InputWrap>
            <div className='px-2 text-[14px] font-fsemibold'>
              m
            </div>
          </div>
        </ItemBox>
        <ItemBox style={{ marginTop: 25, height: '101px', width: 398, marginLeft: 15 }}>
          <ItemTitle>vote deadline (utc)</ItemTitle>
          <div className='flex items-center mt-3'>
            <InputWrap>
              <InputNumber style={InputNumberClass} 
                className=" rounded-lg" 
                placeholder='0'
                value={voteDeadline[0]} 
                onUserInput={ value => {
                  if ((value.length <= 1 && Number(value) === 0) || /^([1-9]|1[0-2])$/.test(value)) {
                    handleDeadlineInput(value, 0, 'vote')
                  }
                  
                }} />
              <NumberAdd 
                onPlus={() => {
                  if (/^([1-9]|1[0-2])$/.test(String(Number(voteDeadline[0]) + 1))) {
                    handleDeadlineInput(Number(voteDeadline[0]) + 1, 0, 'vote')
                  }
                }}
                onMinus={() => {
                  if (/^([1-9]|1[0-2])$/.test(String(Number(voteDeadline[0]) - 1))) {
                    handleDeadlineInput(Number(voteDeadline[0]) - 1, 0, 'vote')
                  }
                }}
              />
            </InputWrap>
            <div className='px-2 text-[14px] font-fsemibold'>
              M
            </div>
            <InputWrap>
              <InputNumber style={InputNumberClass} 
                className=" rounded-lg" 
                placeholder='0'
                value={voteDeadline[1]} 
                onUserInput={ value => {
                  if ((value.length <= 1 && Number(value) === 0) || /^(?:0?[1-9]|[12]\d|3[01])$/.test(value)) {
                    handleDeadlineInput(value, 1, 'vote')
                  }
                }} />
              <NumberAdd 
                onPlus={() => {
                  if (/^(?:0?[1-9]|[12]\d|3[01])$/.test(String(Number(voteDeadline[1]) + 1))) {
                    handleDeadlineInput(Number(voteDeadline[1]) + 1, 1, 'vote')
                  }
                }}
                onMinus={() => {
                  if (/^(?:0?[1-9]|[12]\d|3[01])$/.test(String(Number(voteDeadline[1]) - 1))) {
                    handleDeadlineInput(Number(voteDeadline[1]) - 1, 1, 'vote')
                  }
                }}
              />
            </InputWrap>
            <div className='px-2 text-[14px] font-fsemibold'>
              D
            </div>
            <InputWrap>
              <InputNumber style={InputNumberClass} 
                className=" rounded-lg" 
                placeholder='0'
                value={voteDeadline[2]} 
                onUserInput={ value => {
                  if ((value.length <= 1 && Number(value) === 0) || /^([01]?[0-9]|2[0-3])$/.test(value)) {
                    handleDeadlineInput(value, 2, 'vote')
                  }
                  
                }} />
              <NumberAdd 
                onPlus={() => {
                  if (/^([01]?[0-9]|2[0-3])$/.test(String(Number(voteDeadline[2]) + 1))) {
                    handleDeadlineInput(Number(voteDeadline[2]) + 1, 2, 'vote')
                  }
                }}
                onMinus={() => {
                  if (/^([01]?[0-9]|2[0-3])$/.test(String(Number(voteDeadline[2]) - 1))) {
                    handleDeadlineInput(Number(voteDeadline[2]) - 1, 2, 'vote')
                  }
                }}
              />
            </InputWrap>
            <div className='px-2 text-[14px] font-fsemibold'>
              h
            </div>
            <InputWrap>
              <InputNumber style={InputNumberClass} 
                className=" rounded-lg" 
                placeholder='0'
                value={voteDeadline[3]} 
                onUserInput={ value => {
                  if ((value.length <= 1 && Number(value) === 0) || /^([0-5]\d|[0-9])$/.test(value)) {
                    handleDeadlineInput(value, 3, 'vote')
                  }
                }} />
              <NumberAdd 
                onPlus={() => {
                  if (/^([0-5]\d|[0-9])$/.test(String(Number(voteDeadline[3]) + 1))) {
                    handleDeadlineInput(Number(voteDeadline[3]) + 1, 3, 'vote')
                  }
                }}
                onMinus={() => {
                  if (/^([0-5]\d|[0-9])$/.test(String(Number(voteDeadline[3]) - 1))) {
                    handleDeadlineInput(Number(voteDeadline[3]) - 1, 3, 'vote')
                  }
                }}
              />
            </InputWrap>
            <div className='px-2 text-[14px] font-fsemibold'>
              m
            </div>
          </div>
        </ItemBox>
        {/* <ItemBox style={{ marginTop: 25, height: '101px', width: 200, marginLeft: 15 }}>
          <ItemTitle>duration</ItemTitle>
          <div className='mt-2 font-fmedium'>
            <Select defaultValue={CAMPAIGN_DURATION[0]} options={CAMPAIGN_DURATION} onChange={handleDurationChange} />
          </div>
        </ItemBox> */}
      </div>
      <AwardList onChange={setAwardData} lockedCurrency={selectedCurrencyBalanceUSDT ?? undefined} />
      <Content onChange={setCreateContent} />
      <ItemBox style={{height: '135px', width: '100%', marginTop: 24}}>
        <div className='shrink-0 '>
          <ItemTitle style={{color: '#000'}}>Landing Page</ItemTitle>
          <div className='mt-3 flex items-center'>
            <div className='w-[524px] shrink-0 rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[44px]'>
              <LazyImage src='/images/airdrop/landing.svg' className='mr-2' />
              <TextInput
                color='rgba(0,0,0,0.80)'
                fontSize='14px'
                value={landingPage}
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
          approveLoading && lockedCurrency ?
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
            (approvalState === ApprovalState.PENDING) ?
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
          (!approveLoading && approvalState === ApprovalState.APPROVED || !lockedCurrency) &&
            <ButtonSwap
              disabled={disabled}
              onClick={async e => {
                e.stopPropagation()
                if (createStatus === 1 || uploadStatus === 1) return
                const arwRes = await handleUploadStr(createContent)
                const awardList = awardData.map(item => ([new BN(item.a).multipliedBy(10 ** (lockedCurrency?.decimals ?? 18)).toString(), item.s]))
                handleCreateCampaign(
                  name, label, channel, action, landingPage, arwRes.id, 
                  // @ts-ignore
                  lockedCurrency, lockedCurrencyAirCampaign, 
                  offerAmount, 
                  applyDuration,
                  voteDuration,
                  awardList
                )
              }}
            >
              <div className='btn-text'>
                {
                  (createStatus === 1 || uploadStatus === 1) ? <LoadingX /> : 'Create'
                }
              </div>
            </ButtonSwap>
        }
        </div>
      </div>
      <CurrencySearchModal
        isOpen={modalOpen}
        onDismiss={handleDismissSearch}
        onCurrencySelect={handleInputSelect}
        selectedCurrency={currencies[Field.INPUT]}
        otherSelectedCurrency={currencies[Field.OUTPUT]}
        showCommonBases={false}
        payInput={true}
      />
    </CreateBody>
  )
}
