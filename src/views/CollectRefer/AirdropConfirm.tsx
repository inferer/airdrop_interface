
import React, { useEffect, useMemo, useState } from "react";
import { ButtonCancel, ButtonSwap, ButtonSwapUser } from "../../components/Button";
import { useAirdropList0, useReferNode0 } from "../../state/airdrop/hooks";
import router from 'next/router'
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { useAirdropReceiver } from "../../hooks/useAirdropReceiver";
import { ApprovalState } from "../../hooks/useApproveCallback";
import Loader, { Loading, LoadingX, LoadingXUser } from '../../components/Loader'
import { useAccountLabelScore } from "../../hooks/useAirdropTokenScore";
import { useActiveWeb3React } from "../../hooks";
import AirdropInfo from "./AirdropInfo";
import { useAirdropReferManager } from "../../hooks/useReferManager";

const AirdropConfirm: React.FC<{

}> = () => {
  const { account } = useActiveWeb3React()

  const { 
    handleGetReferNodeList, 
    handleReferTo2, 
    confirmStatus,
    algTokenCurrency,
    approvalState, 
    approve 
  } = useAirdropReferManager(router.query.action && router.query.action[1])

  const { multi, chainId, handleGetAirdropOne } = useAirdropManager()

  useEffect(() => {
    if (router.query.action && router.query.action[2]) {
      handleGetAirdropOne(Number(router.query.action[2]))
      handleGetReferNodeList(Number(router.query.action[2]))
    }
  }, [router.query, multi, chainId])

  const pNode = useReferNode0(router.query.inviter as string)

  const airdrop = useAirdropList0(router.query.action && router.query.action[2])
  const accountScore = useAccountLabelScore(account || '', airdrop.labelToken?.symbol?.slice(4) || '' )

  const [approveLoading, setApproveLoading] = useState(true)
  useEffect(() => {
    if (approvalState !== ApprovalState.UNKNOWN) {
      setApproveLoading(false)
    }
  }, [approvalState])

  return (
    <div className="py-5 pt-0">
      <AirdropInfo airdrop={airdrop} from="user" confirm />
      <div className=" flex justify-center mt-[20px]">
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
                Approve {algTokenCurrency?.symbol?.replace('alg','Alg')} 
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
              if (confirmStatus === 1 || !router.query.action) return
              // handleConfirmTask(airdrop.airdropId, airdrop.labelToken.address, airdrop.labelToken?.symbol?.slice(4) || '', accountScore)
              handleReferTo2(router.query.action[2],  pNode ? pNode.addr : account ?? '')
            }}
          >
            <div className="btn-text">
              {
                confirmStatus === 1 ? <LoadingXUser /> : 'Confirm'
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