import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import AirdropList from './AirdropList'
import router from 'next/router'
import AirdropConfirm from './AirdropConfirm'
import { useAirdropManager } from '../../hooks/useAirdropManager'

function Collect() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // useGetAirdropWithLoadingIndicator()
  
  
  const isAirdropConfirm = router.query.id

  const handleToPage = useCallback(() => {
    if (isAirdropConfirm) {
      router.push('/collect')
    } else {
      router.push('/search')
    }
  }, [router, isAirdropConfirm])

  return (
    <div className='w-[1217px] mx-auto'>
      <TitleWrap>
        <div
          onClick={e => {
            e.stopPropagation()
            handleToPage()
          }}
        >
          <LazyImage className='icon-left cursor-pointer' src="/images/airdrop/arrow-left.svg" />
        </div>
        <TYPE.textGrad1 fontSize={32} fontWeight={600}>
          { isAirdropConfirm ? 'Confirm the Airdrop' : 'Collect the airdrops (6)'} 
        </TYPE.textGrad1>
      </TitleWrap>
      <CollectBody>
        {
          isAirdropConfirm ? <AirdropConfirm /> : <AirdropList />
        }
        
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Collect)
