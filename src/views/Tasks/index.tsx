import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import TaskList from './TaskList'
import router from 'next/router'
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
      router.push('/swap')
    }
  }, [router, isAirdropConfirm])

  return (
    <div className='w-[1217px] mx-auto'>
      <TitleWrap>
        <TYPE.textGrad1 fontSize={32} fontWeight={600}>
          {'Ongoing airdrops'} 
        </TYPE.textGrad1>
      </TitleWrap>
      <CollectBody>
        <TaskList />
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Collect)
