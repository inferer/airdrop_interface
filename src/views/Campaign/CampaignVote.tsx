
import React, { useCallback, useEffect, useMemo, useState } from "react";
import router, { useRouter } from 'next/router'
import CampaignInfo from "./CampaignInfo";
import { ButtonCancel, ButtonSwap, ButtonSwapUser } from "../../components/Button";
import { useIsRoleProjectMode } from "../../state/user/hooks";
import { useCampaignManager } from "../../hooks/useCampaignManager";
import { useCampaignList0 } from "../../state/campaign/hooks";
import VoteContent from "./VoteContent";
import WorkContent from "./WorkContent";
import { useCampaignApply } from "../../hooks/useCapmaignApply";
import { LoadingXUser } from "../../components/Loader";
const bundleId = 'L1y1pS5W-RC2aLjsojpIOA2CUflJPzyeCt3DxRb649Y'
const CampaignVote: React.FC<{
  isVote?: boolean
}> = ({
  isVote
}) => {
  const isProjectMode = useIsRoleProjectMode()
  const router = useRouter()
  const { handleGetCampaignOne } = useCampaignManager()
  const { applyStatus, handleCampaignApply, handleCampaignVote } = useCampaignApply()

  const campaignId = router.query.action && router.query.action[2]

  useEffect(() => {
    if (campaignId) {
      handleGetCampaignOne(Number(campaignId))
    }
  }, [campaignId])

  const campaign = useCampaignList0(router.query?.action ? router.query?.action[2] as string : undefined)

  const handleApplyVote = useCallback(async () => {
    if (campaignId) {
      if (isVote) {
        handleCampaignVote(campaignId, 0)
      } else {
        handleCampaignApply(campaignId, bundleId)
      }
    }
  }, [isVote, campaignId])
  
  return (
    <div className="py-5 pt-0">
      <CampaignInfo campaign={campaign} from={isProjectMode ? 'project' : 'user'} />
      <div>
        {
          isVote ? <VoteContent /> : <WorkContent />
        }
      </div>
      <div className=" flex justify-between mt-5">
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
        <div className="w-[260px] ">
          {
            isProjectMode ? 
            <ButtonSwap
              onClick={() => {
                router.back()
              }}
            >
              <div className="btn-text">
                Return
              </div>
            </ButtonSwap> :
            <ButtonSwapUser
              onClick={() => {
                handleApplyVote()
              }}
            >
              <div className="btn-text">
                {
                  applyStatus === 1 ? <LoadingXUser /> : isVote ? 'Vote' : 'Apply' 
                }
              </div>
            </ButtonSwapUser>
          }
          
        </div>
      </div>
    </div>
  )
}

export default CampaignVote