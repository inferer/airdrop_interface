import React, { useCallback, useContext, useMemo, useState } from 'react'

import { TokensBody } from './styleds'
import TitleTab from '../../components/tokens/TitleTab'
import Banner from '../../components/tokens/Banner'
import TokenList from '../../components/tokens/TokenList'

function Tokens() {
  return (
    <TokensBody>
      <TitleTab />
      <Banner />
      <TokenList />
    </TokensBody>

  )
}

export default React.memo(Tokens)
