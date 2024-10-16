import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { CollectBody, TitleWrap } from './styleds'
import LazyImage from '../../components/LazyImage'
import ReferList from './ReferList'

function ReferListPage() {

  return (
    <>
      <div className='w-[1217px] mx-auto' style={{paddingBottom: 0}}>
        <CollectBody>
          <div className='text-[32px] font-fsemibold mb-10 flex items-center'>
            <LazyImage src='/images/airdrop/ongoing.svg' className=' w-[32px] h-[32px] mr-3' />
            Ongoing refering airdrops
          </div>
          <ReferList /> 
        </CollectBody>
      </div>
      
    </>
  )
}

export default ReferListPage
