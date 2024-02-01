
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
import Loader, { Loading, LoadingX } from '../../components/Loader'
import { useAccountLabelScore } from "../../hooks/useAirdropTokenScore";
import { useActiveWeb3React } from "../../hooks";

const AirdropConfirm: React.FC<{

}> = () => {
  const { account } = useActiveWeb3React()
  const { 
    confirmStatus,
    handleConfirmTask,
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

  return (
    <div className="py-5 pt-0">
      {/* <div className=" text-[36px] font-fsemibold leading-[42px]">{airdrop.name}</div> */}
      <div className="flex items-start mt-14">
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
              <LazyImage src="/images/channel/twitter.svg" className=" rounded-full" />
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
          {/* <div className="flex items-center mt-5">
            <div className="w-[91px] shrink-0">
              <LabelText>Paid</LabelText>
            </div>
            {
              airdrop.labelToken && 
              <div className="flex items-center">
                <div className="py-[2px] px-[10px] h-[34px] flex justify-between items-center rounded border border-[rgba(0,0,0,0.06)]">
                  <LazyImage src={getTokenLogoURL2(airdrop.labelToken)} className="w-5 h-5 mr-1" />
                  <span className=" text-[16px] font-fsemibold">{airdrop.labelToken?.symbol}</span>
                </div>
                <div className="pl-2">
                  x {accountScore || '1'}
                </div>
                <div className="pl-2">
                  x {airdrop.unit}
                </div>
              </div>
            }
            
          </div> */}
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
          <ButtonSwap 
            bgColor='rgba(123,120,255,0.1)'
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <Loading />
            
          </ButtonSwap> : 
          approvalState === ApprovalState.NOT_APPROVED ?
          <ButtonSwap 
              onClick={e => {
                e.stopPropagation()
                approve()
              }}
            >
              <div className='btn-text'>
                Approve {algTokenCurrency?.symbol} 
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
                confirmStatus === 1 ? <LoadingX /> : 'Confirm'
              }
            </div>
          </ButtonSwapUser>
        }
          
        </div>
      </div>
    </div>
  )
}

export default AirdropConfirm