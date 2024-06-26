
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ItemBox, ItemTitle } from "./styleds";
import LazyImage from "../../components/LazyImage";
import { Token } from "@uniswap/sdk";
import CurrencyLogo from "../../components/CurrencyLogo";
import BigNumber from 'bignumber.js'

const AwardListView = ({
  dataList = [],
  offerToken
}: {
  dataList?: any[],
  offerToken?: Token
}) => {

  const totalAmount = useMemo(() => {
    let total = new BigNumber(0)
    dataList.forEach(item => {
      total = total.plus(new BigNumber(item.a || 0).multipliedBy(new BigNumber(item.s || 0)))
    })
    return total.toString()
  }, [dataList])

  return (
    <ItemBox style={{height: 'auto', width: 1135, marginTop: 25}}>
      <div className='text-[16px] font-fsemibold text-[rgba(0,0,0,1)]'>Award</div>
      <div className=' flex mt-6'>
        <div className='w-full pr-6'>
          <div className="award-table">
            <div className="h-[37px] bg-[rgba(85,123,241,0.03)] text-[14px] flex items-center text-[rgba(0,0,0,0.4)] font-fsemibold">
              <div className="w-[101px] pl-5">Tier</div>
              <div className="w-[142px]">Amount</div>
              <div className="w-[100px] pl-[45px]"></div>
              <div className="w-[142px]">Count</div>
              <div className="w-[110px] pl-[50px]"></div>
              <div className="w-[142px] shrink-0">Total fee</div>
              <div className="w-[104px] pl-[50px]"></div>
            </div>
            {
              dataList.map((item, index) => {
                return (
                  <div key={index} className={` h-[60px] text-[14px] flex items-center text-[rgba(0,0,0,1)] font-fsemibold award-table-item
                     hover:bg-[rgba(85,123,241,0.08)] cursor-pointer
                    ${index % 2 === 1 ? 'bg-[rgba(85,123,241,0.04)]' : ' '}
                  `}>
                    <div className="w-[101px] pl-5">
                      <div className="w-[22px] h-[22px] text-[14px] rounded-[4px] border border-[rgba(121,142,206,0.10)] flex items-center justify-center font-fmedium text-[rgba(121,142,206,0.40)]">
                        {index + 1}
                      </div>
                    </div>
                    <div className="w-[142px] flex items-center">
                      <div className="pt-[5px] pb-[6px] px-2 h-[28px] rounded-[4px] bg-[rgba(70,108,228,0.04)] flex items-center text-[#466CE4] text-[14px] font-fsemibold min-w-[50px] ">
                        {item.a || item.amount}
                        {
                          offerToken && <CurrencyLogo currency={offerToken} size={'16px'} style={{marginLeft: 12}} />
                        }
                      </div>
                    </div>
                    <div className="w-[100px] pl-[45px]">
                      <div className="text-[20px] font-fbold text-[#8BA5FF]">x</div>
                    </div>
                    <div className="w-[142px] flex items-center">
                      <div className="pt-[5px] pb-[6px] px-2 h-[24px] min-w-[27px] rounded-[4px] bg-[rgba(70,108,228,0.04)] flex items-center justify-center text-[#466CE4] text-[14px] font-fsemibold ">
                        {item.s || item.size}
                      </div>
                      
                    </div>
                    <div className="w-[110px] pl-[50px]">
                      <div className="text-[20px] font-fbold text-[#8BA5FF]">=</div>
                    </div>
                    <div className="w-[142px] shrink-0 flex">
                      <div className="pt-[5px] pb-[6px] px-2 h-[28px] rounded-[4px] bg-[rgba(70,108,228,0.04)] flex items-center text-[#466CE4] text-[14px] font-fsemibold min-w-[50px] ">
                        { new BigNumber(item.a || item.amount || 0).multipliedBy(new BigNumber(item.s || item.size || 0)).toString()}
                        {
                          offerToken && <CurrencyLogo currency={offerToken} size={'16px'} style={{marginLeft: 12}} />
                        }
                      </div>
                    </div>
                    
                  </div>
                )
              })
            }
            
          </div>
        </div>
        <div className='p-5 rounded-xl bg-[rgba(85,123,241,0.06)] w-[225px] min-h-[277px] shrink-0 relative'>
          <LazyImage src='/images/campaign/bg2.png' className='w-[148px] h-[163px] absolute top-0 right-0' />
          <div className=' relative z-10 flex flex-col justify-between h-full'
          >
            <ItemTitle>Summary</ItemTitle>
            <div className=' text-[rgba(70,108,228,0.60)]'>
              <div className='text-[14px] font-fnormal flex items-center flex-wrap'>
                {
                  dataList.map((item, index) => {
                    return (
                      <div key={index} className="flex items-center">
                        <span className='text'>{(Number(item.a || item.amount) * Number(item.s || item.size))}</span>
                        {
                          index === dataList.length - 1 ? <span className='text-[18px] ml-4'>=</span> : <span className='text-[16px] mx-2'>+</span>
                        }
                        
                      </div>
                    )
                  })
                }

              </div>
              <div className='text-[45px] font-fsemibold mt-5 text-[#466CE4] flex items-baseline leading-normal'>
                {totalAmount}
                {
                  offerToken && <CurrencyLogo currency={offerToken} size={'16px'} style={{marginLeft: 12}} />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </ItemBox>
  )
}

export default AwardListView