import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import TaskList from './TaskList'
import { useAirdropReceiver } from '../../hooks/useAirdropReceiver'
import { ButtonSwap } from '../../components/Button'
import Loader, { Confirmed, Loading } from '../../components/Loader'
import TextInput from '../../components/TextInput'

// http://36.26.92.165:13884/api/airdrop-manager/completeTask?userAddress=0xfba7fE606D2253BDD2955f8a8fEC240A4c6f279a&airdropId=6

function Collect() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const { completeStatus, handleUserCompleteTask, handleConfirmCompleteTask } = useAirdropReceiver()

  const [ids, setIds] = useState<string[]>([])
  const handleOnChecked = useCallback((keys: string[]) => {
    setIds(keys)
  }, []) 

  const [userAddress, setUserAddress] = useState('')
  const [airdropId, setAirdropId] = useState('')

  useEffect(() => {
    let timer: any = null
    if (completeStatus === 2) {
      timer = setTimeout(() => {
        setIds([])
      }, 1500)
    }
    return () => {
      timer && clearTimeout(timer)
    }
  }, [completeStatus])

  return (
    <>
      <div className='w-[1217px] mx-auto'>
        <CollectBody>
        <div className='text-[32px] font-fsemibold mb-10'>
          Ongoing airdrops
        </div>
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
      </div>
      {
        ids.length > 0 && 
        <div className=' fixed bottom-0 left-0 right-0 h-[107px] bg-white z-10 flex items-center'
          style={{ boxShadow: '0px 4px 30px 0px rgba(107, 190, 225, 0.16)' }}
        >
          <div className='w-[1217px] mx-auto'>
            <div className=" flex justify-between items-center">
              {
                (completeStatus === 0 || completeStatus === -1) && 
                <>
                  <div className=' text-[18px] font-fnormal'>
                    Do you confirm that you have completed the selected airdrops?
                  </div>
                  <div className='w-[200px]'>
                    <ButtonSwap 
                      height='40px'
                      onClick={e => {
                        e.stopPropagation()
                        if (account === '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea') {
                          handleConfirmCompleteTask(userAddress, [airdropId])
                        } else {
                          handleUserCompleteTask(ids)
                        }
                        
                      }}
                    >
                      
                      <TYPE.textGrad1 fontWeight={600} fontSize={16}>
                        {
                          'Confirm'
                        }
                      </TYPE.textGrad1>
                    </ButtonSwap>
                  </div>
                </>
              }
              {
                completeStatus === 1 && 
                <>
                  <div className=' text-[18px] font-fnormal'>
                    Checking the airdrop status in contract...
                  </div>
                  <div className='px-10'>
                    <Loading />
                  </div>
                </>
              }
              {
                completeStatus === 2 && 
                <>
                  <div className=' text-[18px] font-fnormal'>
                    Received 15.11 air-Social tokens.
                  </div>
                  <div className='px-10'>
                    <Confirmed />
                  </div>
                </>
              }
              
              
            </div>
          </div>
        </div>
      }
      
    </>
  )
}

export default Collect
