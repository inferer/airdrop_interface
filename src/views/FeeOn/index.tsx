import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useActiveWeb3React } from '../../hooks'
import { LoadingX } from '../../components/Loader'
import { useProjectContractDemo } from '../../hooks/useAirdropReceiver'
import { othersContracts } from '../../constants/contractsLocal'
import { useRouter } from 'next/router'
import CheckBox from '../../components/CheckBox'
import { useAirdropAssetTreasuryFeeOn } from '../../hooks/useAirdropAssetTreasury'
import { isAddress } from '../../utils'

// 0xfba7fE606D2253BDD2955f8a8fEC240A4c6f279a

function FeeOn() {
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const isOwner = useMemo(() => '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' === account, [account])

  const { 
    feeStatus, 
    handleSetFeeTo,
    handleSetFeeOn,
    handleGetFeeOn,
    handleSetsAirdropDiscountPercentage,
    handleSetsIncomePercentage
  } = useAirdropAssetTreasuryFeeOn()


  const [feeTo, setFeeTo] = useState('')
  const [feeOn, setFeeOn] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState('')
  const [incomePercentage, setIncomePercentage] = useState('')
  const [discountPercentageAddress, setDiscountPercentageAddress] = useState('')
  const [incomePercentageAddress, setIncomePercentageAddress] = useState('')

  const handleOnChange = useCallback((value, type) => {
    if (type === 'feeTo') {
      setFeeTo(value)
    }
    if (type === 'FeeOn') {
      setFeeOn(value)
    }
    if (type === 'DiscountPercentage') {
      setDiscountPercentage(value)
    }
    if (type === 'IncomePercentage') {
      setIncomePercentage(value)
    }
  }, [])

  const handleOnAddressChange = useCallback((value, type) => {
    if (type === 'DiscountPercentage') {
      setDiscountPercentageAddress(value)
    }
    if (type === 'IncomePercentage') {
      setIncomePercentageAddress(value)
    }
    if (isAddress(value)) {
      handleGetFeeOn(value)
      .then((res: any) => {
        setFeeOn(res.feeOn)
        setFeeTo(res.feeTo)
        setDiscountPercentage(res.discountPercentage)
        setIncomePercentage(res.incomePercentage)
      })
    }
  }, [handleGetFeeOn])

  useEffect(() => {
    handleGetFeeOn()
      .then((res: any) => {
        setFeeOn(res.feeOn)
        setFeeTo(res.feeTo)
        setDiscountPercentage(res.discountPercentage)
        setIncomePercentage(res.incomePercentage)
      })
  }, [handleGetFeeOn])


  return (
    <div className='bg-white w-full h-[100vh] fixed left-0 top-0 pt-32'>

    <div className='w-[1217px] mx-auto '>
      <div>
        <div className='flex items-center mb-10'>
          <div className=' font-fsemibold text-[32px]'>
            {'Fee On Config'}
          </div>
        </div>
        <div className='px-10'>
          <div className='py-3 flex items-center'>
            <span className='pr-5'>Fee ON:</span> 
            <CheckBox checked={feeOn} onChange={(value) => {
              handleOnChange(value, 'FeeOn')
            }} /> 
            <div className=' ml-10'>
              {
                isOwner && 
                <button 
                  className='border p-2'
                  onClick={e => {
                    e.stopPropagation()
                    if (feeStatus === 1) return
                    handleSetFeeOn(feeOn)
                  }}
                >
                  <div className="btn-text w-[120px]">
                    {
                      feeStatus === 1 ? 'Processing...' : 'Confirm'
                    }
                  </div>
                </button>
              }
              
            </div>
          </div>
          <div className='py-3 flex items-center'>
            <span className='pr-5'>Fee To:</span> 
            <input type="text"
              placeholder='Fee to address'
              className='w-[400px] whitespace-nowrap shrink-0 overflow-auto rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px] text-[13px] text-[rgba(0,0,0,0.40)]'
              value={feeTo}
              onChange={e => {
                handleOnChange(e.target.value, 'feeTo')
              }}
            />
            <div className=' ml-10'>
              {
                isOwner && 
                <button 
                  className='border p-2'
                  onClick={e => {
                    e.stopPropagation()
                    if (feeStatus === 1) return
                    handleSetFeeTo(feeTo)
                  }}
                >
                  <div className="btn-text w-[120px]">
                    {
                      feeStatus === 1 ? 'Processing...' : 'Confirm'
                    }
                  </div>
                </button>
              }
              
            </div>
          </div>
          <div className='py-3 flex items-center'>
            <span className='pr-5'>DiscountPercentage:</span> 
            <input type="text"
              placeholder='Address'
              className='w-[340px] whitespace-nowrap shrink-0 overflow-auto rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px] text-[13px] text-[rgba(0,0,0,0.40)]'
              value={discountPercentageAddress}
              onChange={e => {
                handleOnAddressChange(e.target.value, 'DiscountPercentage')
              }}
            />
            <span className='px-1'>-</span>
            <input type="text"
              className='w-[120px] whitespace-nowrap shrink-0 overflow-auto rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px] text-[13px] text-[rgba(0,0,0,0.40)]'
              value={discountPercentage}
              onChange={e => {
                handleOnChange(e.target.value, 'DiscountPercentage')
              }}
            /> 
            <span className='pl-2'>/ 1000</span>
            <div className=' ml-10'>
              {
                isOwner && 
                <button 
                  className='border p-2'
                  onClick={e => {
                    e.stopPropagation()
                    if (!isAddress(discountPercentageAddress)) {
                      alert('Invalid address')
                      return
                    }
                    if (feeStatus === 1) return
                    handleSetsAirdropDiscountPercentage(discountPercentageAddress, discountPercentage)
                  }}
                >
                  <div className="btn-text w-[120px]">
                    {
                      feeStatus === 1 ? 'Processing...' : 'Confirm'
                    }
                  </div>
                </button>
              }
              
            </div>
          </div>
          <div className='py-3 flex items-center'>
            <span className='pr-5'>IncomePercentage:</span> 
            <input type="text"
              placeholder='Address'
              className='w-[340px] whitespace-nowrap shrink-0 overflow-auto rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px] text-[13px] text-[rgba(0,0,0,0.40)]'
              value={incomePercentageAddress}
              onChange={e => {
                handleOnAddressChange(e.target.value, 'IncomePercentage')
              }}
            />
            <span className='px-1'>-</span>
            <input type="text"
              className='w-[120px] whitespace-nowrap shrink-0 overflow-auto rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px] text-[13px] text-[rgba(0,0,0,0.40)]'
              value={incomePercentage}
              onChange={e => {
                handleOnChange(e.target.value, 'IncomePercentage')
              }}
            />
            <span className='pl-2'>/ 1000</span>
            <div className=' ml-10'>
              {
                isOwner && 
                <button 
                  className='border p-2'
                  onClick={e => {
                    e.stopPropagation()
                    if (!isAddress(incomePercentageAddress)) {
                      alert('Invalid address')
                      return
                    }
                    if (feeStatus === 1) return
                    handleSetsIncomePercentage(incomePercentageAddress, incomePercentage)
                  }}
                >
                  <div className="btn-text w-[120px]">
                    {
                      feeStatus === 1 ? 'Processing...' : 'Confirm'
                    }
                  </div>
                </button>
              }
              
            </div>
          </div>

          
          
        </div>

        
        
      </div>
    </div>
    </div>

    
  )
}

export default React.memo(FeeOn)
