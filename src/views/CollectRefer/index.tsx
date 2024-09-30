import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import AirdropList from './AirdropList'
import router from 'next/router'
import AirdropConfirm from './AirdropConfirm'
import { useIsRoleProjectMode } from '../../state/user/hooks'

function Collect() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const isProjectMode = useIsRoleProjectMode()
  // const isAirdropConfirm = router.query.id && router.query.id[1]
  const isAirdropConfirm = router.query.action ? router.query.action[2] : ''

  return (
    <div className='w-[1217px] mx-auto'>
      <CollectBody>
        <div className='flex items-center mb-10'>
          {
            !isAirdropConfirm && <LazyImage src='/images/airdrop/label_icon.svg' className=' w-[24px] h-[24px] mr-3' />
          }
          
          <div className=' font-fsemibold text-[32px]'>
            {isAirdropConfirm ? 'Confirm the Airdrop' : 'Airdrops'} 
          </div>
        </div>
        
        {
          isAirdropConfirm ? <AirdropConfirm /> : <AirdropList />
        }
        
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Collect)
