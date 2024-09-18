import { useMemo, useState } from "react"
import LazyImage from "../../components/LazyImage"
import { ItemBox, ItemTitle } from "../Create/styleds"
import { IAirdrop } from "../../state/airdrop/actions"
import CurrencyLogo from "../../components/CurrencyLogo"

const ReferAction = ({airdrop}: {
  airdrop: IAirdrop
}) => {
  console.log(airdrop)
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
                      {coverage}
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
          <ItemBox width={1080} height={982} style={{ marginTop: 20, height: 'auto' }} >
            <div className=' flex justify-center text-[14px] font-fnormal'>Spreading chart</div>
            <div className="bg-[rgba(85,123,241,0.05)] border border-solid border-[rgba(85,123,241,0.50)] w-[965px] h-[533px] rounded-[14px] mt-3 ">

            </div>
            <div className='w-full h-auto border border-[rgba(85,123,241,0.10) rounded-md mt-[30px]'>
              <div
                onClick={e => {
                  e.stopPropagation()
                  setExpend(!expend)
                }} 
                className=' cursor-pointer flex items-center justify-between bg-[rgba(85,123,241,0.10)] w-full h-[48px] px-5' style={{borderRadius: '6px 6px 0px 0px'}}>
                <div className=' flex items-center'>
                  <LazyImage src='/images/airdrop/icon/info.svg' />
                  <span className='text-[12px] font-fmedium ml-[6px]'>Compound income calculation</span>
                </div>
                <div
                  className=' cursor-pointer'
                  
                >
                  <LazyImage src='/images/airdrop/icon/arrow-down.svg' className={`transition-all ${expend ? ' -rotate-180' : ''}`} />
                </div>
              </div>
                {
                expend && 
                <div className='p-5 text-[12px] font-fnormal'>
                  <div>Compound income is calculated exponentially based on 1 Air-Social. As the refer percentage changes, compound benefits would grow massively. Assume the compound income is CI, the refer precentage is R, the offer per unit is O, n is the number of people who refers, then the formula would be such as:</div>
                  <div className='mt-[39px] mb-[33px]'>
                    <LazyImage src='/images/airdrop/icon/ci1.png' className='w-[462px]' />
                  </div>
                  <div>For example, the refer percentage is 0.75, the offer per unit is 1 x Air-Social token, and we maximize the refer process, then we could have the compound income equal to 3 x Air-Social token.</div>
                  <div className='mt-[20px] mb-[32px]'>
                    <LazyImage src='/images/airdrop/icon/ci2.png' className='w-[746px]' />
                  </div>
                  <div>
                  With thid refer design mechanism deployed in contract, there would be always expotential benefits when peple refer further and acquire lots of fun.
                  </div>
                </div>
                }
              
            </div>
            
          </ItemBox>
        </div>
      </ItemBox>
    </div>
  )
}

export default ReferAction

