import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useActiveWeb3React } from '../../hooks'
import { LoadingXUser } from '../../components/Loader'
import { useProjectContractDemo } from '../../hooks/useAirdropReceiver'
import { othersContracts } from '../../constants/contractsLocal'
import { useRouter } from 'next/router'

function Collect() {
  const router = useRouter()
  const { account } = useActiveWeb3React()

  const { confirmStatus, handleCommentAction, handleGetTaskInfo, airdropInfo, handleTestGas } = useProjectContractDemo()

  useEffect(() => {
    if (account) {
      handleGetTaskInfo(account)
      // handleTestGas()
    }
  }, [account])

  console.log(airdropInfo)
  const [parameter, setParameter] = useState<any>([])
  const contentJson = useMemo(() => {
    let obj: any = {
      contractAddress: '',
      functionName: '',
      chain: '',
      parameter: [],
      landingPage: ''
    }
    if (airdropInfo.content) {
      const contentArr = airdropInfo.content.split('.')
      obj.contractAddress = contentArr[0]
      obj.functionName = contentArr[1]
    }
    obj.chain = airdropInfo.chain ?? ''
    obj.landingPage = airdropInfo.landingPage ?? ''
    obj.parameter = airdropInfo.parameterInfo ?? []
    setParameter(obj.parameter)
    return obj
  }, [airdropInfo])

  const handleOnChange = useCallback((value, index) => {
    parameter[index].value = value
    setParameter([...parameter])
  }, [parameter])

  return (
    <div className='bg-white w-full h-[100vh] fixed left-0 top-0 pt-32'>

    <div className='w-[1217px] mx-auto '>
      <div>
        <div className='flex items-center mb-10'>
          <div className=' font-fsemibold text-[32px]'>
            {'Project Contract Task Test'} 
          </div>
        </div>
        <div className='px-10'>
          <div className='py-3'>Contract: {contentJson.contractAddress}</div>
          <div className='py-3'>Function: {contentJson.functionName}</div>
          <div className='py-3 flex'>
            <div>
              Parameter: 
            </div>
            <div>
              {
                parameter.map((item: any, index: number) => {
                  return (
                    <div key={item.name} className='flex justify-between items-center mb-3'>
                      <div className=' w-full flex items-center'>
                        <div className='text-[13px] text-[rgba(0,0,0,0.60)] pl-2 pr-4'>{item.name} ({item.type})</div>
                      </div>
                      <input type="text"
                        className='w-[400px] whitespace-nowrap shrink-0 overflow-auto rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px] text-[13px] text-[rgba(0,0,0,0.40)]'
                        value={parameter[index].value}
                        onChange={e => {
                          handleOnChange(e.target.value, index)
                        }}
                      />
                      {/* <div className='w-[400px] whitespace-nowrap shrink-0 overflow-auto rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px] text-[13px] text-[rgba(0,0,0,0.40)]'>
                        {item.value}
                      </div> */}
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className='py-3'>Reward: {airdropInfo.unit} {airdropInfo.labelToken?.symbol}</div>

          <div className='w-[260px] mt-10'>
            <button 
              className='border p-2'
              onClick={e => {
                e.stopPropagation()
                if (confirmStatus === 1 || airdropInfo.taskCompleted) return
                handleCommentAction(airdropInfo.parameterInfo[0].value, airdropInfo.parameterInfo[1].value, airdropInfo.parameterInfo[2].value)
              }}
            >
              <div className="btn-text w-[120px]">
                {
                  confirmStatus === 1 ? 'Processing...' : airdropInfo.taskCompleted ? 'Has completed' : 'Complete Task'
                }
              </div>
            </button>
          </div>
        </div>

        
        
      </div>
    </div>
    </div>

    
  )
}

export default React.memo(Collect)
