import React, { useCallback, useContext, useMemo, useState } from 'react'
import { CollectBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import AirdropConfirmDetails from './AirdropConfirmDetails'
import { useRouter } from 'next/router'

function Collect() {
  const router = useRouter()
  const isOngoing = router.query.action && router.query.action[0] === 'ongoing'
  return (
    <div className='w-[1217px] mx-auto'>
      <CollectBody>
        <div className='flex items-center mb-10'>
          <LazyImage src={isOngoing ? '/images/airdrop/ongoing.svg' : '/images/airdrop/completed.svg'} className=' w-[32px] h-[32px] mr-3' />
          
          <div className=' font-fsemibold text-[32px]'>
            {isOngoing ? 'Ongoing Airdrop' : 'Completed Airdrop'} 
          </div>
        </div>
        
        <AirdropConfirmDetails />
        
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Collect)
