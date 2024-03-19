
import React, { useEffect, useMemo, useState } from "react";
import { ButtonCancel, ButtonSwap, ButtonSwapUser } from "../../components/Button";
import { useAirdropList0 } from "../../state/airdrop/hooks";
import router from 'next/router'
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { useAirdropReceiver } from "../../hooks/useAirdropReceiver";
import { ApprovalState } from "../../hooks/useApproveCallback";
import Loader, { Loading, LoadingX, LoadingXUser } from '../../components/Loader'
import { useAccountLabelScore } from "../../hooks/useAirdropTokenScore";
import { useActiveWeb3React } from "../../hooks";
import AirdropInfo from "./AirdropInfo";

const AirdropConfirm: React.FC<{

}> = () => {
  const { account } = useActiveWeb3React()
  const { 
    confirmStatus,
    handleConfirmTask,
    algTokenCurrency,
    approvalState, 
    approve 
  } = useAirdropReceiver(router.query.action && router.query.action[1])
  const { handleGetAirdropOne } = useAirdropManager()

  useEffect(() => {
    if (router.query.action && router.query.action[2]) {
      handleGetAirdropOne(Number(router.query.action[2]))
    }
  }, [router.query])


  const airdrop = useAirdropList0(router.query.action && router.query.action[2])
  const accountScore = useAccountLabelScore(account || '', airdrop.labelToken?.symbol?.slice(4) || '' )

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
          
        </div>
      </div>
    </div>
  )
}

export default AirdropConfirm