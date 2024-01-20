import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { TokensBody } from './styleds'
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
