import React, { useCallback, useContext, useMemo, useState } from 'react'
import { CampaignBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import CampaignConfirmDetails from './CampaignConfirmDetails'
import { useRouter } from 'next/router'

function CampaignDetails() {
  
  return (
    <div className='w-[1217px] mx-auto'>
      <CampaignBody>
        <div className='flex items-center mb-10'>
          <LazyImage src={'/images/tokens/swap/alg-campaign.svg'} className=' w-[32px] h-[32px] mr-3' />
          
          <div className=' font-fsemibold text-[32px]'>
            {'Campaign'} 
          </div>
        </div>
        
        <CampaignConfirmDetails />
        
      </CampaignBody>
    </div>
    
  )
}

export default React.memo(CampaignDetails)
