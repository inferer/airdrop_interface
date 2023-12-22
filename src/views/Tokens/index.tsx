import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import AlgTokenList from './AlgTokenList2'
import router from 'next/router'
import AirTokenList from './AirTokenList'

function Tokens() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()


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

export default React.memo(Tokens)
