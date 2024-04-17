import React from 'react'

import { TokensBody } from './styleds'
import AirUSDTTokenList from '../../components/tokens/AirUSDTTokenList'

function Tokens() {
  return (
    <TokensBody>
      <AirUSDTTokenList />
    </TokensBody>

  )
}

export default React.memo(Tokens)
