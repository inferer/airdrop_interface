import { useMemo, useState } from "react"
import LazyImage from "../../components/LazyImage"
import { ItemBox, ItemTitle } from "../Create/styleds"
import { IAirdrop } from "../../state/airdrop/actions"
import CurrencyLogo from "../../components/CurrencyLogo"
import R8Compound from "./R8Compound"
import IncomeCalculation from "../Create/IncomeCalculation"
import SpreadingChart from "../Create/SpreadingChart"

const ReferAction = ({airdrop, from = 'project'}: {
  airdrop: IAirdrop,
  from?: String,
}) => {
  const [currentPer, setCurrentPer] = useState(0.5)
  const [lockedAmount, setlockedAmount] = useState(100)
  const coverage = useMemo(() => {
    return Math.ceil(Number(airdrop.labelLocked) / currentPer)
  }, [currentPer, airdrop])

  const incomePer = useMemo(() => {
    let _index = 5;
    if (currentPer >= 1) {
      _index = 5
    }
    let _amount = 0;
    while(_index > 0) {
      _amount += Math.pow(currentPer, _index)
      _index--;
    }
    return 100 + Math.floor(_amount * 100)
  }, [currentPer])
  const [expend, setExpend] = useState(true)

  return (
    <div className='mt-5'>
      <ItemBox width={1120} height={1349 }  style={{height: 'auto'}}>
        <ItemTitle>Refer Action</ItemTitle>
        <div className='px-1'>
          <div className='text-[rgba(0,0,0,0.80)] text-[16px] font-fmedium my-[30px]'>Scroll the indicator to forcast the refer spreading outcome.</div>
          <ItemBox width={1080} height={207} >
            <div className='flex items-center'>
              <div className='w-full'>
                <div className='flex items-center'>
                  <div className='w-[50%] shrink-0'>
                    <div className='flex items-center text-[#3F4664] font-fbold'>
                      <LazyImage src='/images/airdrop/icon/icon1.svg' className='mr-[6px]' />
                      Refer Percentage
                    </div>
                    <div className='text-[rgba(63,70,100,0.60)] text-[16px] font-fnormal mt-4'>
                      {(currentPer * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className='w-[50%] shrink-0'>
                    <div className='flex items-center text-[#3F4664] font-fbold'>
                      <LazyImage src='/images/airdrop/icon/icon2.svg' className='mr-[6px]' />
                      Estimate coverage
                    </div>
                    <div className='text-[rgba(63,70,100,0.60)] text-[16px] font-fnormal mt-4'>
                      {coverage || ''}
                    </div>
                  </div>
                </div>
                <div className='flex items-center mt-[37px]'>
                  <div className='w-[50%] shrink-0'>
                    <div className='flex items-center text-[#3F4664] font-fbold'>
                      <LazyImage src='/images/airdrop/icon/icon3.svg' className='mr-[6px]' />
                      Offer per unit
                    </div>
                    
                    <div className='flex items-center mt-4'>
                      <div className='text-[rgba(63,70,100,0.60)] inline-flex text-[16px] font-fnormal px-2 py-[6px] h-[36px] items-center justify-center rounded-[4px] border border-[rgba(85,123,241,0.10)]'>
                        <CurrencyLogo currency={airdrop.labelToken} size={'14px'} />
                        <span className='ml-1'>{airdrop.labelToken?.symbol}</span>
                        
                      </div>
                      <div className='text-[rgba(63,70,100,0.60)] text-base ml-2'>
                        X 1
                      </div>
                    </div>
                  </div>
                  <div className='w-[50%] shrink-0'>
                    <div className='flex items-center text-[#3F4664] font-fbold'>
                      <LazyImage src='/images/airdrop/icon/icon4.svg' className='mr-[6px]' />
                      Contract
                    </div>
                    <div className='text-[rgba(63,70,100,0.60)] inline-flex text-[16px] font-fnormal mt-4 px-2 py-[6px] h-[36px] items-center justify-center rounded-[4px] border border-[rgba(85,123,241,0.10)] cursor-pointer'>
                      Code Preview
                    </div>
                  </div>
                </div>
              </div>
              <div className=' shrink-0 w-[370px]'>
                <div className=' flex items-center justify-between'>
                  <div className='w-[1px] h-[86px] bg-[rgba(63,70,100,0.10)] '></div>
                  <div className='text-[102px] font-fbold primary-text leading-[110%]'>
                    {incomePer}%
                  </div>
                </div>
                <div className=' text-right'>
                  Compound income
                </div>
              </div>
            </div>
          </ItemBox>
          <ItemBox width={1120} height={982} style={{ marginTop: 20, height: 'auto' }} >
            {
              from === 'project' ? <SpreadingChart /> : <R8Compound />
            }
            
            <IncomeCalculation />
          </ItemBox>
        </div>
      </ItemBox>
    </div>
  )
}

export default ReferAction

