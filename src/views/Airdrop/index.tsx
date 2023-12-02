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

  const [algToken1, setAlgToken1] = useState('0x13c85F531c614a4e6B2fF95171dE1C600DA83655')
  const [amount, setAmount] = useState('1000')

  const [algToken, setAlgToken] = useState('0x13c85F531c614a4e6B2fF95171dE1C600DA83655')
  const [airToken, setAirToken] = useState('0x72a99424410249D5ba34A49445691D4f88cFb47E')

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
          <div>Activity: 0x13c85F531c614a4e6B2fF95171dE1C600DA83655</div>
          <div>Social: 0x0060F0f8FB3e02eA7f798b643a783a69B06F21ca</div>
          <div>Sport: 0x2f2C7bD8dB48b2c1F74e867B250Ab70B2671C18C</div>
          <div>Game: 0x56Ca824283f68332C0e49a67A0d3F24e93184164</div>
          <div>Art: 0xa8427c8dA7c9e3071984f7DDF51AeA44c27DDD39</div>
          <div>Finance: 0x8e34B4a08D3B73c1aD5e170c76726207b6f34C2c</div>
        </div>
        <div style={{ marginLeft: 100 }}>
          <div>Air tokens: </div>
          <div>Activity: 0x72a99424410249D5ba34A49445691D4f88cFb47E</div>
          <div>Social: 0x3a1b55A11036B6B9056e6f53Cb76b22811f7d3Dd</div>
          <div>Sport: 0x55F6DF7a4BF225ACBbb9bD34cE6557CC085A77ed</div>
          <div>Game: 0x8584fCdf6D511743beD39d12eD6F7BC9A1E3Fc17</div>
          <div>Art: 0x77258b21Ce41212C36FD60524DC4BB570cf36426</div>
          <div>Finance: 0x271Ed95915DDFE288e615580BFfE05A54E5cc325</div>
        </div>
      </div>
    </AirdropWrapper>
  )
}
