import React from 'react'

import { CollectBody } from '../Collect/styleds'
import LazyImage from "../../components/LazyImage";
import { OngoingList } from './Ongoing'


function Ongoing() {

  return (
    <div className='w-[1217px] mx-auto'>
      <CollectBody>
          <div className='text-[32px] font-fsemibold mb-10 flex items-center'>
            <LazyImage src='/images/airdrop/completed.svg' className=' w-[32px] h-[32px] mr-3' />
            Completed airdrops
          </div>
        <OngoingList completed />
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Ongoing)
