
import React, { useEffect, useMemo, useState } from "react";
import router, { useRouter } from 'next/router'
import CampaignInfo from "./CampaignInfo";
import { ButtonSwap, ButtonSwapUser } from "../../components/Button";
import { useIsRoleProjectMode } from "../../state/user/hooks";
import { useCampaignManager } from "../../hooks/useCampaignManager";
import { useCampaignApplyVoteList, useCampaignList0 } from "../../state/campaign/hooks";
import { useCampaignApply } from "../../hooks/useCapmaignApply";
import VoteContent from "./VoteContent";
import AwardContent from "./AwardContent";

const CampaignConfirmDetails: React.FC<{

}> = () => {
  const isProjectMode = useIsRoleProjectMode()
  const router = useRouter()
  const { handleGetCampaignOne } = useCampaignManager()
  const { handleGetCampaignApplyVotes } = useCampaignApply()
  const campaignApplyVoteList = useCampaignApplyVoteList(router.query.action && router.query.action[1])
  useEffect(() => {
    if (router.query.action) {
      const id = router.query.action[1]
      handleGetCampaignOne(Number(id))
      handleGetCampaignApplyVotes(id)
    }
  }, [router.query, handleGetCampaignOne, handleGetCampaignApplyVotes])

  const campaign = useCampaignList0(router.query?.action ? router.query?.action[1] as string : undefined)
  
  return (
    <div className="py-5 pt-0">
      <CampaignInfo campaign={campaign} from={isProjectMode ? 'project' : 'user'} />
      {/* <AwardContent campaign={campaign} applyVoteList={campaignApplyVoteList} from="project" /> */}
      <VoteContent campaign={campaign} applyVoteList={campaignApplyVoteList} from="project" />
      <div className=" flex justify-center">
        <div className="w-[260px] mt-5">
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
                router.back()
              }}
            >
              <div className="btn-text">
                Return
              </div>
            </ButtonSwapUser>
          }
          
        </div>
      </div>
    </div>
  )
}

export default CampaignConfirmDetails