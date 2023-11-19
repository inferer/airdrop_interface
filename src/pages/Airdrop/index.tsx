import React, { useContext, useMemo, useState } from 'react'
import { Text } from 'rebass'
import { ButtonPrimary, ButtonSecondary, ButtonGray } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'

import { AirdropWrapper } from './styleds'
import { useAirdrop } from '../../state/user/hooks'
import TextInput from '../../components/TextInput'

export default function Pool() {
  const { account } = useActiveWeb3React()

  const { handleAirdrop, handleAirdropSwap } = useAirdrop()

  const [algToken1, setAlgToken1] = useState('0x82c9DdA6a281e4a147eA9b29B87FbF2B3c2D633F')
  const [amount, setAmount] = useState('1000')

  const [algToken, setAlgToken] = useState('0x82c9DdA6a281e4a147eA9b29B87FbF2B3c2D633F')
  const [airToken, setAirToken] = useState('0xd9E31AD67cca5E979aB2A845d6173dAe0d4006e0')

  return (
    <AirdropWrapper>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '90vw'}}>
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
    </AirdropWrapper>
  )
}
