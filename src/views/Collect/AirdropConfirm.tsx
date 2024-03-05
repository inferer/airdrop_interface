
import React, { useEffect, useMemo, useState } from "react";
import LazyImage from "../../components/LazyImage";
import { FlexCenter, LabelText } from "./styleds";
import { ButtonCancel, ButtonSwap, ButtonSwapUser } from "../../components/Button";
import { TYPE } from "../../theme";
import { useAirdropList0 } from "../../state/airdrop/hooks";
import router from 'next/router'
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { useAirdropReceiver } from "../../hooks/useAirdropReceiver";
import { ApprovalState } from "../../hooks/useApproveCallback";
import Loader, { Loading, LoadingX, LoadingXUser } from '../../components/Loader'
import { useAccountLabelScore } from "../../hooks/useAirdropTokenScore";
import { useActiveWeb3React } from "../../hooks";
import CurrencyLogo from "../../components/CurrencyLogo";
import { openBrowser } from "../../utils";

const AirdropConfirm: React.FC<{

}> = () => {
  const { account } = useActiveWeb3React()
  const { 
    confirmStatus,
    handleConfirmTask,
    handleRegisterTask,
    algTokenCurrency,
    approvalState, 
    approve 
  } = useAirdropReceiver(router.query.id && router.query.id[0])
  const { handleGetAirdropOne, handleGetUserTaskConfirmed } = useAirdropManager()

  useEffect(() => {
    if (router.query.id && router.query.id[1]) {
      handleGetAirdropOne(Number(router.query.id[1]))
    }
  }, [router.query])


  const airdrop = useAirdropList0(router.query.id && router.query.id[1])
  const accountScore = useAccountLabelScore(account || '', airdrop.labelToken?.symbol?.slice(4) || '' )

  const [userTaskConfirmed, setUserTaskConfirmed] = useState<any>({})

  useEffect(() => {
    if (account && airdrop) {
      // handleGetUserTaskConfirmed(airdrop.airdropId)
      //   .then(res => {
      //     setUserTaskConfirmed(res)
      //   })
    }
  }, [account, airdrop])
  const [approveLoading, setApproveLoading] = useState(true)
  useEffect(() => {
    if (approvalState !== ApprovalState.UNKNOWN) {
      setApproveLoading(false)
    }
  }, [approvalState])

  const contentJson = useMemo(() => {
    let obj: any = {
      contractAddress: '',
      functionName: '',
      chain: '',
      parameter: [],
      landingPage: ''
    }
    if (airdrop.content) {
      console.log(airdrop.content)
      const contentArr = airdrop.content.split('.')
      obj.contractAddress = contentArr[0]
      obj.functionName = contentArr[1]
    }
    obj.chain = airdrop.chain ?? ''
    obj.landingPage = airdrop.landingPage ?? ''
    obj.parameter = airdrop.parameterInfo ?? []

    return obj
  }, [airdrop])

  return (
    <div className="py-5 pt-0">
      {/* <div className="flex items-start mt-14">
        <div className="w-[420px]">
          <div className="flex items-center">
            <div className="w-[91px] shrink-0">
              <LabelText>Name</LabelText>
            </div>
            <div>
              <div className="text-black text-[16px] font-normal">
                <FlexCenter>{airdrop.name}</FlexCenter>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-5">
            <div className="w-[91px] shrink-0">
              <LabelText>Fund</LabelText>
            </div>
            <div className="flex items-baseline font-fnormal">
              <div className=" text-[16px]">
                {airdrop.offerLocked}
              </div>
              {
                airdrop.offerToken?.symbol && <div className="text-[16px] ml-2">{airdrop.offerToken?.symbol}</div>
              }
              
            </div>
          </div>
          <div className="flex items-center mt-5">
            <div className="w-[91px] shrink-0">
              <LabelText>Action</LabelText>
            </div>
            <div className="py-[2px] px-[10px] flex justify-between items-center rounded border border-[rgba(0,0,0,0.06)]">
              <span className=" text-[16px] font-fsemibold">{airdrop.action}</span>
            </div>
          </div>
          
        </div>

        <div className=" flex-1 relative -top-[5px]">
          <div className="flex items-center">
            <div className="w-[91px] shrink-0">
              <LabelText>Label</LabelText>
            </div>
            <div>
              <div className="text-[rgba(63,60,255,0.8)] text-[16px] font-fmedium rounded-lg bg-[rgba(63,60,255,0.05)] px-2 h-[35px] flex items-center">
                <FlexCenter>{airdrop.label}</FlexCenter>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-7">
            <div className="w-[91px] shrink-0">
              <LabelText>Channel</LabelText>
            </div>
            <div>
              {
                airdrop.channel === 'twitter' && <LazyImage src="/images/channel/twitter.svg" className=" rounded-full" />
              }
              {
                airdrop.channel === 'contract' && <div className="py-[2px] px-[10px] flex justify-between items-center rounded border border-[rgba(0,0,0,0.06)]">
                <span className=" text-[16px] font-fsemibold">Contract</span>
              </div>
              }
            </div>
          </div>
          <div className="flex items-center mt-7">
            <div className="w-[91px] shrink-0">
              <LabelText>Expire On</LabelText>
            </div>
            <div>
              {airdrop.expireOn}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <LabelText>Content</LabelText>
        <div className="p-4 rounded-xl bg-[rgba(85,123,241,0.03)] font-fnormal h-[136px] mt-3 flex">
          <LazyImage src="/images/airdrop/link.svg" className="w-5 h-5 mr-1" />
          <div className="">
            {airdrop.content}
          </div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-[rgba(147,205,155,0.04)] font-fnormal mt-3">
        <div className=" text-[rgba(147,205,155,0.8)] text-[16px] font-fsemibold ">Airdrop token would be issued from contract.</div>
        <div className=" text-[rgba(147,205,155,0.8)] text-[14px] font-normal mt-2 leading-[18px] ">Once you confirmed the airdrop, the alg-* token would be locked in protocol until the airdrop content gets done. And the Alg-* token would be transformed into Air-* token and transferred into your account for later trade in airdrop pools..</div>
      </div> */}
      <div className="">
        <div className="h-[171px] rounded-xl border border-[rgba(85, 123, 241, 0.1)] overflow-hidden">
          <div className="h-[64px] w-full flex items-center bg-[rgba(85,123,241,0.02)] pl-5 text-[24px] font-fsemibold"> {airdrop.name}</div>
          <div className="grid grid-cols-4 mt-5">
            <div className="pl-5">
              <LabelText>Pool</LabelText>
              <div className="mt-3 flex">
                <div className="text-[rgba(63,60,255,0.8)] text-[16px] font-fmedium rounded-lg bg-[rgba(63,60,255,0.05)] px-2 h-[35px] flex items-center">
                  <FlexCenter>{airdrop.label}</FlexCenter>
                </div>
              </div>
              
            </div>
            <div className="pl-5 flex items-center">
              <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
              <div>
                <LabelText>Reward</LabelText>
                <div className="mt-3 flex">
                  <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                    <div className=" text-[16px] font-semibold">
                      {airdrop.unit}  x
                    </div>
                    {/* {
                      airdrop.offerToken?.symbol && <div className="text-[16px] ml-2">{airdrop.offerToken?.symbol}</div>
                    } */}
                    <div className='bg-[#F2F9F3] rounded flex items-center py-[1px] px-2 ml-[11px]'>
                      {
                        airdrop.labelToken && <CurrencyLogo currency={airdrop.labelToken} size={'20px'} />
                      }
                      
                      <div className=' font-fmedium text-[#A1CEA8] ml-1'>
                        {airdrop.labelToken?.symbol}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pl-5 flex items-center">
              <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
              <div>
                <LabelText>Fund</LabelText>
                <div className="mt-3 flex">
                  <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                    <div className=" text-[16px] font-fsemibold mr-1">
                      {airdrop.offerLocked}
                    </div>
                    {
                      airdrop.offerToken && <CurrencyLogo currency={airdrop.offerToken} size={'20px'} />
                    }
                    
                    {/* {
                      airdrop.offerToken?.symbol && <div className="text-[16px] ml-2">{airdrop.offerToken?.symbol}</div>
                    } */}
                  </div>
                </div>
              </div>
            </div>
            <div className="pl-5 flex items-center">
              <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
              <div>
                <LabelText>Expire On</LabelText>
                <div className="mt-3 flex">
                  <div className="flex items-baseline font-fnormal">
                    <div className=" text-[16px] text-[rgba(0,0,0,0.4)]">
                      {airdrop.expireOn}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[335px] rounded-xl border border-[rgba(85, 123, 241, 0.1)] overflow-hidden mt-5 p-5">
          <div className="h-[94px] overflow-auto">
            <div className=" flex ">
              <div>
                <LabelText>Chain</LabelText>
                <div className="h-[44px] w-[134px] flex items-center mt-3 px-4 bg-[rgba(85,123,241,0.02)] rounded-lg">
                  <LazyImage src="/images/airdrop/chain_airdrop.svg" />
                  <div className="text-[14px] font-fmedium ml-2">{contentJson.chain}</div>
                </div>
              </div>
              <div className="ml-[50px]">
                <LabelText>Contract</LabelText>
                <div className="h-[44px] flex items-center mt-3 px-4 border border-[rgba(85,123,241,0.10)] rounded-xl">
                  <LazyImage src="/images/airdrop/contract_logo.svg" />
                  <div className="text-[14px] font-fnormal mx-2">{contentJson.contractAddress}</div>
                  <LazyImage src="/images/airdrop/contract_verify.svg" />
                </div>
              </div>
              <div className="ml-[50px]">
                <LabelText>Function</LabelText>
                <div className="h-[44px] w-[338px] flex items-center mt-3 px-4 bg-[rgba(85,123,241,0.02)] rounded-lg">
                  <LazyImage src="/images/airdrop/fun.svg" />
                  <div className="text-[14px] font-fmedium ml-2">{contentJson.functionName}</div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <LabelText>Parameter</LabelText>
              <div className=" grid grid-cols-2 gap-x-[50px]">
                {
                  contentJson.parameter.map((item: any) => {
                    return (
                      <div key={item.name} className='flex justify-between items-center mt-3'>
                        <div className=' w-full flex items-center'>
                          <LazyImage src='/images/airdrop/param.svg' />
                          <div className='text-[13px] text-[rgba(0,0,0,0.60)] pl-2 pr-4'>{item.name} ({item.type})</div>
                        </div>
                        <div className='w-[300px] whitespace-nowrap shrink-0 overflow-auto rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px] text-[13px] text-[rgba(0,0,0,0.40)]'>
                          {item.value}
                        </div>
                      </div>
                    )
                  })
                }
                
                {/* <div className='flex justify-between items-center mt-3'>
                  <div className=' w-full flex items-center'>
                    <LazyImage src='/images/airdrop/param.svg' />
                    <div className='text-[13px] text-[rgba(0,0,0,0.60)] pl-2 pr-4'>_maxDepositsCount (uint256)</div>
                  </div>
                  <div className='w-[300px] shrink-0 rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px]'>
                    <TextInput  
                      color='rgba(0,0,0,0.40)'
                      fontSize='13px'
                      value={''} 
                      onUserInput={value => {

                      }} 
                    />
                  </div>
                </div> */}
                
              </div>
            </div>
          </div>
          
          <div className="mt-5">
            <LabelText>Landing Page</LabelText>
            <div className="flex">
              <div className="h-[44px] flex items-center mt-3 px-4 border border-[rgba(85,123,241,0.10)] rounded-xl">
                <LazyImage src="/images/airdrop/landing.svg" />
                <div className="text-[14px] font-fnormal mx-2">{contentJson.landingPage}</div>
                <div className=" cursor-pointer"
                  onClick={e => {
                    e.stopPropagation()
                    openBrowser(contentJson.landingPage)
                  }}
                >
                  <LazyImage src="/images/airdrop/share6.svg" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[rgba(147,205,155,0.04)] rounded-xl p-3 mt-5 text-[rgba(147,205,155,0.80)]">
            <div className=" text-[14px] font-fsemibold leading-normal mb-2">
              Airdrop token would be issued from contract.
            </div>
            <div className="text-[13px] font-fnormal leading-4">
              Once you confirmed the airdrop, the alg-* token would be locked in protocol until the airdrop content gets done. And the alg-* token would be transformed into air-* token and transferred into your account for later trade in airdrop pools.
            </div>
          </div>
        </div>
      </div>
      <div className=" flex justify-center mt-[50px]">
        <div className='w-[260px] mr-[180px]'>
          <ButtonCancel
            onClick={e => {
              e.stopPropagation()
              router.back()
            }}
          >
            <div className="btn-text">Cancel</div>
          </ButtonCancel>
        </div>
        <div className='w-[260px]'>
        {/* {
          algTokenCurrency &&
            <ButtonSwap
              onClick={approve}
            >
              <TYPE.textGrad1 fontWeight={600} fontSize={20}>
                { approvalState === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader />
                    </AutoRow>
                  ) : approvalState === ApprovalState.APPROVED ? (
                    'Approved ' + algTokenCurrency?.symbol
                  ) : (
                    `Approve ${algTokenCurrency?.symbol}`
                  )
                }
              </TYPE.textGrad1>
            </ButtonSwap>
        } */}
        {
          approveLoading ? 
          <ButtonSwapUser 
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <Loading />
            
          </ButtonSwapUser> : 
          approvalState === ApprovalState.NOT_APPROVED ?
          <ButtonSwapUser 
              onClick={e => {
                e.stopPropagation()
                approve()
              }}
            >
              <div className='btn-text'>
                Approve {algTokenCurrency?.symbol} 
              </div>
              
            </ButtonSwapUser> : null
        }
        {
          (approvalState === ApprovalState.PENDING) ?
          <ButtonSwapUser 
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <LoadingXUser />
          </ButtonSwapUser> : null
        }
        {
          !approveLoading && approvalState === ApprovalState.APPROVED && 
          <ButtonSwapUser 
            onClick={e => {
              e.stopPropagation()
              if (confirmStatus === 1) return
              handleConfirmTask(airdrop.airdropId, airdrop.labelToken.address, airdrop.labelToken?.symbol?.slice(4) || '', accountScore)
            }}
          >
            <div className="btn-text">
              {
                confirmStatus === 1 ? <LoadingXUser /> : 'Confirm'
              }
            </div>
          </ButtonSwapUser>
        }
        {/* {
          !approveLoading && approvalState === ApprovalState.APPROVED && airdrop.channel === 'contract' && 
          <ButtonSwapUser 
            onClick={e => {
              e.stopPropagation()
              if (confirmStatus === 1) return
              handleRegisterTask(airdrop.airdropId, airdrop.labelToken.address, airdrop.labelToken?.symbol?.slice(4) || '', accountScore)
            }}
          >
            <div className="btn-text">
              {
                confirmStatus === 1 ? <LoadingXUser /> : 'Register'
              }
            </div>
          </ButtonSwapUser>
        } */}
          
        </div>
      </div>
    </div>
  )
}

export default AirdropConfirm