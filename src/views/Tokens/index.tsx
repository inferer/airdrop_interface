import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import AlgTokenList from './AlgTokenList'
import router from 'next/router'
import AirTokenList from './AirTokenList'

function Collect() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const isAirdropConfirm = router.query.id && router.query.id[1]
  const handleToPage = useCallback(() => {
    if (isAirdropConfirm && router.query?.id) {
      router.push(`/collect/${router.query?.id[0]}`)
    } else {
      router.push('/search')
    }
  }, [router, isAirdropConfirm])

  return (
    <div className='w-[1440px] mx-auto flex'>
      <CollectBody>
        <div className=' font-fsemibold text-[18px] mb-5'>Assets to receive</div>
        <AirTokenList />
      </CollectBody>
      <CollectBody>
        <div className=' font-fsemibold text-[18px] mb-5'>Assets to consume</div>
        <AlgTokenList />
        
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Collect)
