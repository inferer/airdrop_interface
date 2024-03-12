import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import AirdropConfirmDetails from './AirdropConfirmDetails'

function Collect() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  

  return (
    <div className='w-[1217px] mx-auto'>
      <CollectBody>
        <div className='flex items-center mb-10'>
          <LazyImage src='/images/airdrop/label_icon.svg' className=' w-[24px] h-[24px] mr-3' />
          
          <div className=' font-fsemibold text-[32px]'>
            {true ? 'Ongoing airdrop' : 'Airdrops'} 
          </div>
        </div>
        
        <AirdropConfirmDetails />
        
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Collect)
