import React, { useContext, useMemo } from 'react'
import { Text } from 'rebass'
import { ButtonPrimary, ButtonSecondary, ButtonGray } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'

import { AirdropWrapper } from './styleds'
import { useAirdrop } from '../../state/user/hooks'

export default function Pool() {
  const { account } = useActiveWeb3React()

  const { handleAirdrop, handleAirdropSwap } = useAirdrop()

  return (
    <AirdropWrapper>
      <AutoColumn gap="lg" justify="center">
        <ButtonPrimary id="airdrop-button" style={{ padding: 16 }} 
          onClick={handleAirdrop}
        >
          <Text fontWeight={500} fontSize={20}>
            Airdrop algToken
          </Text>
        </ButtonPrimary>
        <ButtonGray id="swap-button" style={{ padding: 16 }} 
          onClick={handleAirdropSwap}
        >
          <Text fontWeight={500} fontSize={20}>
            Swap for airToken
          </Text>
        </ButtonGray>
      </AutoColumn>
    </AirdropWrapper>
  )
}
