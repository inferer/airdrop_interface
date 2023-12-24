import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import TaskList from './TaskList'
import router from 'next/router'
import { useAirdropReceiver } from '../../hooks/useAirdropReceiver'
import { ButtonSwap } from '../../components/Button'
import Loader from '../../components/Loader'
import TextInput from '../../components/TextInput'

// http://36.26.92.165:13884/api/airdrop-manager/completeTask?userAddress=0xfba7fE606D2253BDD2955f8a8fEC240A4c6f279a&airdropId=6

function Collect() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const { completeStatus, handleCompleteTask } = useAirdropReceiver()

  const [ids, setIds] = useState<string[]>([])
  const handleOnChecked = (keys: string[]) => {
    console.log(keys)
    setIds(keys)
  }

  const [userAddress, setUserAddress] = useState('')
  const [airdropId, setAirdropId] = useState('')

  return (
    <>
      <div className='w-[1217px] mx-auto'>
        <TitleWrap>
          <TYPE.textGrad1 fontSize={32} fontWeight={600}>
            {'Ongoing airdrops'} 
          </TYPE.textGrad1>
        </TitleWrap>
        <CollectBody>
        {
          account !== '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea' ?
          <TaskList onChecked={handleOnChecked} /> :
          <div>
            <div>
              userAddress: 
              <TextInput value={userAddress} onUserInput={ val => {
                setUserAddress(val)
              } } />
            </div>
            <div>
              airdropId: 
              <TextInput value={airdropId} onUserInput={ val => {
                setAirdropId(val)
              } } />
            </div>
            
          </div>
        }
          
        </CollectBody>
        {
          account === '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea' && 
          <div className=" flex justify-end">
            <div className='w-[260px]'>
              <ButtonSwap 
                onClick={e => {
                  e.stopPropagation()
                  handleCompleteTask(userAddress, [airdropId])
                }}
              >
                <TYPE.textGrad1 fontWeight={600} fontSize={20}>
                  {
                    completeStatus === 1 ? <Loader /> : 'Confirm'
                  }
                </TYPE.textGrad1>
              </ButtonSwap>
            </div>
          </div>
        }
        
      </div>
    </>
  )
}

export default React.memo(Collect)
