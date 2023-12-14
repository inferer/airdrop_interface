import React, { useContext, useMemo, useState } from 'react'
import { Text } from 'rebass'
import { ButtonPrimary, ButtonSecondary, ButtonGray } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'

import { AirdropWrapper } from './styleds'
import { useAirdrop } from '../../state/user/hooks'
import TextInput from '../../components/TextInput'
import { AIRLABEL_TOKEN_LIST, ALGLABEL_TOKEN_LIST } from '../../constants/tokenList'

export default function Pool() {
  const { account } = useActiveWeb3React()

  const { handleAirdrop, handleAirdropSwap } = useAirdrop()

  const [algToken1, setAlgToken1] = useState(ALGLABEL_TOKEN_LIST[0].address)
  const [amount, setAmount] = useState('1000')

  const [algToken, setAlgToken] = useState(ALGLABEL_TOKEN_LIST[0].address)
  const [airToken, setAirToken] = useState(AIRLABEL_TOKEN_LIST[0].address)

  return (
    <AirdropWrapper>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw'}}>
        <AutoColumn gap="lg" justify="center">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div>AlgToken: </div>
            <div style={{width: 300}}>
              <TextInput value={algToken1} onUserInput={ val => {
                setAlgToken1(val)
              } } />
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', }}>
            <div>Amount: </div>
            <div style={{width: 300}}>
              <TextInput value={amount} onUserInput={ val => {
                setAmount(val)
              } } />
            </div>
          </div>
          <ButtonPrimary id="airdrop-button" style={{ padding: 16 }} 
            onClick={() => handleAirdrop(algToken1, amount)}
          >
            <Text fontWeight={500} fontSize={20}>
              Airdrop algToken
            </Text>
          </ButtonPrimary>
        </AutoColumn>
        <div style={{width: 200}}></div>
        <AutoColumn gap="lg" justify="center">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div>AlgToken: </div>
            <div style={{width: 300}}>
              <TextInput value={algToken} onUserInput={ val => {
                setAlgToken(val)
              } } />
            </div>
            
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div>AirToken: </div>
            <div style={{width: 300}}>
              <TextInput value={airToken} onUserInput={val => {
                setAirToken(val)
              }} />
            </div>
            
          </div>
          <ButtonGray id="swap-button" style={{ padding: 16 }} 
            onClick={() => handleAirdropSwap(algToken, airToken)}
          >
            <Text fontWeight={500} fontSize={20}>
              Swap for airToken
            </Text>
          </ButtonGray>
        </AutoColumn>
      </div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw' ,marginTop: 100}}>
        <div>
          <div>Alg tokens: </div>
          {
            ALGLABEL_TOKEN_LIST.map(token => {
              return <div key={token.address}>{token.symbol}: {token.address}</div>
            })
          }
        </div>
        <div style={{ marginLeft: 100 }}>
          <div>Air tokens: </div>
          {
            AIRLABEL_TOKEN_LIST.map(token => {
              return <div key={token.address}>{token.symbol}: {token.address}</div>
            })
          }

        </div>
      </div>
    </AirdropWrapper>
  )
}
