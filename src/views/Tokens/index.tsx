import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap, TokensBody } from './styleds'
import AlgTokenList from './AlgTokenList2'
import router from 'next/router'
import AirTokenList from './AirTokenList'
import TitleTab from '../../components/tokens/TitleTab'
import Banner from '../../components/tokens/Banner'
import TokenList from '../../components/tokens/TokenList'

function Tokens() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()


  return (
    <TokensBody>
      <TitleTab />
      <Banner />
      <TokenList />
    </TokensBody>

  )
}

export default React.memo(Tokens)
