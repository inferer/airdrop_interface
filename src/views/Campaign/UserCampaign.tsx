import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CampaignBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import CampaignList from './CampaignListAlg'
import { useRouter } from 'next/router'
import CampaignVote from './CampaignVote'
import ApplyVoteSwitch from './ApplyVoteSwitch'
import { useCampaignApply } from '../../hooks/useCapmaignApply'
import { useCampaignApplyVoteList } from '../../state/campaign/hooks'

function UserCampaign() {
  const router = useRouter()
  const isCampaignVote = router.query.action ? router.query.action[2] : ''
  const campaignId = isCampaignVote
  const [isVote, setIsVote] = useState(true)
  const { handleGetCampaignApplyVotes } = useCampaignApply()
  const campaignApplyVoteList = useCampaignApplyVoteList(campaignId)

  useEffect(() => {
    handleGetCampaignApplyVotes(campaignId)
  }, [campaignId, handleGetCampaignApplyVotes])

  useEffect(() => {
    if (campaignApplyVoteList?.length < 1) {
      setIsVote(false)
    } else {
      setIsVote(true)
    }
  }, [campaignApplyVoteList])

  return (
    <div className='w-[1217px] mx-auto'>
      <CampaignBody>
        <div className='flex items-center justify-between mb-10'>
          <div className='flex items-center'>
            {
              !isCampaignVote && <LazyImage src='/images/tokens/swap/air-campaign.svg' className=' w-[24px] h-[24px] mr-3' />
            }
            <div className=' font-fsemibold text-[32px]'>
              {isCampaignVote ? 'Join the Campaign' : 'Campaigns'} 
            </div>
          </div>
          {
            (isCampaignVote && campaignApplyVoteList?.length > 0) && <ApplyVoteSwitch onChange={setIsVote} />
          }
          
        </div>
        
        {isCampaignVote ? <CampaignVote isVote={isVote} campaignApplyVoteList={campaignApplyVoteList} /> : <CampaignList /> } 
        
      </CampaignBody>
    </div>
    
  )
}

export default React.memo(UserCampaign)
