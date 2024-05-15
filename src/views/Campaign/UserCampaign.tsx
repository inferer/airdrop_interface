import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CampaignBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import CampaignList from './CampaignListAlg'
import { useRouter } from 'next/router'
import CampaignVote from './CampaignVote'
import ApplyVoteSwitch from './ApplyVoteSwitch'

function UserCampaign() {
  const router = useRouter()
  const isCampaignVote = router.query.action ? router.query.action[2] : ''
  const [isVote, setIsVote] = useState(true)
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
            isCampaignVote && <ApplyVoteSwitch onChange={setIsVote} />
          }
          
        </div>
        
        {isCampaignVote ? <CampaignVote isVote={isVote} /> : <CampaignList /> } 
        
      </CampaignBody>
    </div>
    
  )
}

export default React.memo(UserCampaign)
