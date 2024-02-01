import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import TaskList from './TaskList'
import { useAirdropReceiver } from '../../hooks/useAirdropReceiver'
import { ButtonSwap, ButtonSwapUser } from '../../components/Button'
import Loader, { Confirmed, Loading } from '../../components/Loader'
import TextInput from '../../components/TextInput'
import { useRouter } from 'next/router'
import LazyImage from '../../components/LazyImage'
import { IAirdrop } from '../../state/airdrop/actions'

// http://36.26.92.165:13884/api/airdrop-manager/completeTask?userAddress=0xfba7fE606D2253BDD2955f8a8fEC240A4c6f279a&airdropId=6
function Collect() {
  const router = useRouter()
  const { account } = useActiveWeb3React()

  const { completeStatus, setCompleteStatus, completeErrorMessage, handleUserCompleteTask, handleConfirmCompleteTask } = useAirdropReceiver()

  const [ids, setIds] = useState<string[]>([])
  const [idsObj, setIdsObj] = useState({})

  const handleOnChecked = useCallback((airdropList: IAirdrop[]) => {
    let checkdObj: any = null
    const keys = airdropList.map(airdrop => {
      if (!checkdObj) checkdObj = {}
      if (!checkdObj[airdrop.label]) {
        checkdObj[airdrop.label] = {
          amount: Number(airdrop.unit) * (airdrop.accountScore ?? 1),
          tokenName: airdrop.labelToken.name
        }
      } else {
        checkdObj[airdrop.label].amount += Number(airdrop.unit) * (airdrop.accountScore ?? 1)
      }
      return airdrop.id
    })
    setIds(keys)
    setIdsObj({...checkdObj})
  }, []) 

  const successTip = useMemo(() => {
    const list = Object.values(idsObj)
    if (list.length > 0) {
      const timStr = list.map((item: any, index: number) => ((index > 0 ? ' ' : '') + item.amount + ' ' + item.tokenName + (index > 0 && index < list.length - 1 ? ', ' : '')))
      return 'Received ' + timStr + ' tokens.'
    }
    return ''
  }, [idsObj])

  const [userAddress, setUserAddress] = useState('')
  const [airdropId, setAirdropId] = useState('')

  const handleCheck = useCallback(() => {
    setIds([])
    setCompleteStatus(0)
    router.push('/user/completed')
  }, [])

  // useEffect(() => {
  //   let timer: any = null
  //   if (completeStatus === 2) {
  //     timer = setTimeout(() => {
  //       setIds([])
  //       setCompleteStatus(0)
  //       router.push('/user/completed')
  //     }, 1500)
  //   }
  //   return () => {
  //     timer && clearTimeout(timer)
  //   }
  // }, [completeStatus])

  return (
    <>
      <div className='w-[1217px] mx-auto' style={{paddingBottom: ids.length > 0 ?  117 : 0}}>
        <CollectBody>
        <div className='text-[32px] font-fsemibold mb-10 flex items-center'>
          <LazyImage src='/images/airdrop/ongoing.svg' className=' w-[32px] h-[32px] mr-3' />
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
          <div className='w-[1217px] mx-auto px-10'>
            <div className=" flex justify-between items-center">
              {
                (completeStatus === 0) && 
                <>
                  <div className=' text-[18px] font-fnormal'>
                    Do you confirm that you have completed the selected airdrops?
                  </div>
                  <div className='w-[200px]'>
                    <ButtonSwapUser 
                      height='47px'
                      onClick={e => {
                        e.stopPropagation()
                        if (account === '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea') {
                          handleConfirmCompleteTask(userAddress, [airdropId])
                        } else {
                          handleUserCompleteTask(ids)
                        }
                        
                      }}
                    >
                      
                      <div className='btn-text' style={{fontSize: '16px'}}>
                        {
                          'Confirm'
                        }
                      </div>
                    </ButtonSwapUser>
                  </div>
                </>
              }
              {
                completeStatus === 1 && 
                <>
                  <div className=' text-[18px] font-fnormal'>
                    Checking the airdrop status in contract...
                  </div>
                  <div className='pl-10'>
                    <Loading />
                  </div>
                </>
              }
              {
                completeStatus === 2 && 
                <>
                  <div className=' text-[18px] font-fnormal'>
                    {successTip}
                  </div>
                  <div className='w-[200px]'>
                    <ButtonSwapUser 
                      height='47px'
                      onClick={e => {
                        e.stopPropagation()
                        handleCheck()
                      }}
                    >
                      
                      <div className='btn-text flex items-center' style={{fontSize: '16px'}}>
                        Check
                        <LazyImage src='/images/airdrop/user-r.svg' />
                      </div>
                    </ButtonSwapUser>
                  </div>
                </>
              }

              {
                completeStatus === -1 && 
                <>
                  <div className=' text-[18px] font-fnormal flex items-center'>
                    <LazyImage src='/images/airdrop/error.svg' className='mr-[10px]' />
                    {completeErrorMessage}
                  </div>
                  <div className='w-[200px]'>
                    <ButtonSwapUser 
                      height='47px'
                      onClick={e => {
                        e.stopPropagation()
                        if (account === '0xD815eCd85248f82AC48e12aAd2C23EFad86A89ea') {
                          handleConfirmCompleteTask(userAddress, [airdropId])
                        } else {
                          handleUserCompleteTask(ids)
                        }
                        
                      }}
                    >
                      
                      <div className='btn-text flex items-center' style={{fontSize: '16px'}}>
                        Retry
                        <LazyImage src='/images/airdrop/retry.svg' />
                      </div>
                    </ButtonSwapUser>
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
