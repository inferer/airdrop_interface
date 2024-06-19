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
import { useCampaignApplyVoteList, useCampaignList0 } from '../../state/campaign/hooks'
import { useCampaignManager } from '../../hooks/useCampaignManager'

function UserCampaign() {
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const isCampaignVote = router.query.action ? router.query.action[2] : ''
  const campaignId = isCampaignVote
  const { handleGetCampaignApplyVotes } = useCampaignApply()
  const { handleGetCampaignOne } = useCampaignManager()
  const campaignApplyVoteList = useCampaignApplyVoteList(campaignId)
  const campaign = useCampaignList0(router.query?.action ? router.query?.action[2] as string : undefined)

  useEffect(() => {
    if (campaignId) {
      handleGetCampaignApplyVotes(campaignId)
      handleGetCampaignOne(Number(campaignId))
    }
  }, [campaignId, handleGetCampaignApplyVotes, handleGetCampaignOne])

  const isVote = useMemo(() => {
    return campaign.isApplyExpired
  }, [campaign])

  const userApply = useMemo(() => {
    return account ? campaignApplyVoteList.find(item => item.applyUser.toLowerCase() === account.toLowerCase()) : undefined
  }, [account, campaignApplyVoteList])

  return (
    <div className='w-[1217px] mx-auto'>
      <CampaignBody>
        <div className='flex items-center justify-between mb-10'>
          <div className='flex items-center'>
            {
              !isCampaignVote && <LazyImage src='/images/tokens/swap/air-campaign.svg' className=' w-[24px] h-[24px] mr-3' />
            }
            <div className=' font-fsemibold text-[32px]'>
              {isCampaignVote ? (campaign.isExpired ? 'Campaign Info' : campaign.isApplyExpired ? 'Vote the Campaign' : 'Apply the Campaign') : 'Campaigns'} 
            </div>
          </div>
          {/* <ApplyVoteSwitch onChange={setIsVote} value={isVote} /> */}
          
        </div>
        
        {isCampaignVote ? 
          <CampaignVote 
            isVote={isVote} 
            campaignApplyVoteList={campaignApplyVoteList} 
            userApply={userApply}
          /> : 
          <CampaignList /> } 
        
      </CampaignBody>
    </div>
    
  )
}

export default React.memo(UserCampaign)
