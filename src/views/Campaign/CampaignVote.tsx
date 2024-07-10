
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
import { LoadingX, LoadingXUser } from "../../components/Loader";
import { ICampaignApplyVote } from "../../state/campaign/actions";
import { getIryId } from "../../utils/iry";

const CampaignVote: React.FC<{
  isVote?: boolean,
  campaignApplyVoteList: ICampaignApplyVote[],
  userApply?: ICampaignApplyVote
}> = ({
  isVote,
  campaignApplyVoteList,
  userApply
}) => {
  const isProjectMode = useIsRoleProjectMode()
  const router = useRouter()
  const { applyStatus, handleCampaignApply, handleCampaignVote, handleCampaignUpdate } = useCampaignApply()

  const campaignId = router.query.action && router.query.action[2]
  const [arwId, setArwId] = useState('')
  const [fileType, setFileType] = useState('')
  const [bonus, setBonus] = useState('')

  const campaign = useCampaignList0(router.query?.action ? router.query?.action[2] as string : undefined)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const handleApplyVote = useCallback(async () => {
    if (campaignId) {
      if (userApply) {

        if (!campaign.isApplyExpired) {
          handleCampaignUpdate(campaignId, fileType + '-' + arwId, bonus)
        } else {
          handleCampaignVote(campaignId, currentIndex)
        }
      } else {
        if (campaign.isApplyExpired) {
          handleCampaignVote(campaignId, currentIndex)
        } else {
          handleCampaignApply(campaignId, fileType + '-' + arwId, bonus)
            .then(() => {
  
            })
        }
      }
      
    }
    
  }, [campaign, campaignId, currentIndex, arwId, fileType, bonus, userApply])

  const disabled = useMemo(() => {
    if (campaign.isExpired) return true
    if (isVote) {
      return currentIndex < 0 || campaign.isExpired
    }
    if (!isVote) {
      if (Number(bonus) > 0 && bonus !== userApply?.bonus) {
        return false
      }
      return !arwId || campaign.isApplyExpired || (arwId === getIryId(userApply?.arwId || ''))
    }
    return false
  }, [currentIndex, isVote, arwId, campaign, userApply, bonus])

  const handleOnUpload = useCallback(async (arwId, fileType) => {
    setArwId(arwId)
    setFileType(fileType)
  }, [])

  return (
    <div className="py-5 pt-0">
      <CampaignInfo 
        campaign={campaign} 
        from={isProjectMode ? 'project' : 'user'} 
        isVote={isVote} 
        onBonusChange={setBonus}
        userApply={userApply}
      />
      <div>
        {
          (campaign.campaignId && campaign.isApplyExpired) && <VoteContent campaign={campaign} applyVoteList={campaignApplyVoteList} onSelect={setCurrentIndex} /> 
            
        }
        
        {
          (campaign.campaignId && !campaign.isApplyExpired) && 
            <WorkContent campaign={campaign} applyId={campaignApplyVoteList?.length}
            onUpload={handleOnUpload}
            userApply={userApply}
            bonusChange={bonus !== userApply?.bonus}
          />
            
        }
      </div>
      <div className=" flex justify-center mt-5"> 
        {
          !campaign.isExpired &&
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
        }
        {
          Number(campaign.campaignId) > 0 && 
          <div className="w-[260px] ">
            {
              (isProjectMode || campaign.isExpired) ? 
              <ButtonSwap
                onClick={() => {
                  router.back()
                }}
              >
                <div className="btn-text">
                  Return
                </div>
              </ButtonSwap> :
              <ButtonSwap
                disabled={disabled}
                onClick={() => {
                  if (disabled) return
                  handleApplyVote()
                }}
              >
                <div className="btn-text">
                  {
                    applyStatus === 1 ? <LoadingX /> : ( campaign.isExpired ? 'Complete' : campaign.isApplyExpired ? 'Vote' : userApply ? 'Update' : 'Apply')
                  }
                </div>
              </ButtonSwap>
            }
            
          </div>
        }
        
      </div>
    </div>
  )
}

export default CampaignVote