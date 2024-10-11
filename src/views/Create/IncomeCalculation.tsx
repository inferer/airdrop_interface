import { useState } from "react"
import LazyImage from "../../components/LazyImage"


const IncomeCalculation = () => {

  const [expend, setExpend] = useState(true)

  return (
    <div className='w-full h-auto border border-[rgba(85,123,241,0.10) rounded-md mt-[30px]'>
      <div
        onClick={e => {
          e.stopPropagation()
          setExpend(!expend)
        }} 
        className='flex items-center justify-between bg-[rgba(85,123,241,0.10)] w-full h-[48px] px-5' style={{borderRadius: '6px 6px 0px 0px'}}>
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
  )
}

export default IncomeCalculation