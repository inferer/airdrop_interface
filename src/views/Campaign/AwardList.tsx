
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ItemBox, ItemTitle } from "./styleds";
import LazyImage from "../../components/LazyImage";
import Input from "../../components/NumericalInput";

const AwardList = ({
  onChange
}: {
  onChange?: (dataList: any[]) => void
}) => {

  const [dataList, setDataList] = useState<any[]>([{amount: '', size: ''}])

  const handleAmountInput = useCallback((value, index) => {
    const dataItem = { ...dataList[index], amount: value}
    dataList[index] = dataItem
    setDataList([...dataList])
  }, [dataList])

  const handleSizeInput = useCallback((value, index) => {
    const dataItem = { ...dataList[index], size: value}
    dataList[index] = dataItem
    setDataList([...dataList])
  }, [dataList])

  const handleAddDataItem = useCallback(() => {
    const dataItem = {amount: '', size: ''}
    setDataList([...dataList, dataItem])
  }, [dataList])

  const handleDelDataItem = useCallback((index) => {
    dataList.splice(index, 1)
    setDataList([...dataList])
  }, [dataList])

  useEffect(() => {
    onChange && onChange(dataList)
  }, [dataList])

  const totalAmount = useMemo(() => {
    return dataList.reduce((total, item) => total + (item.amount * item.size), 0)
  }, [dataList])

  return (
    <ItemBox style={{height: 'auto', width: 1128, marginTop: 25}}>
      <div className='text-[16px] font-fsemibold text-[rgba(0,0,0,0.5)] mt-[14px]'>Award</div>
      <div className=' flex mt-6'>
        <div className='w-full pr-6'>
          <div className="award-table">
            <div className="h-[37px] bg-[rgba(85,123,241,0.03)] text-[14px] flex items-center text-[rgba(0,0,0,0.4)] font-fsemibold">
              <div className="w-[101px] pl-5">Tier</div>
              <div className="w-[142px]">Amount (ETH)</div>
              <div className="w-[100px] pl-[45px]"></div>
              <div className="w-[142px]">Size</div>
              <div className="w-[110px] pl-[50px]"></div>
              <div className="w-[142px] shrink-0">Calculated fee(ETH)</div>
              <div className="w-[104px] pl-[50px]"></div>
            </div>
            {/* <div className="h-[60px] text-[14px] flex items-center text-[rgba(0,0,0,1)] font-fsemibold award-table-item">
              <div className="w-[101px] pl-5">1</div>
              <div className="w-[142px] flex items-center">
                <Input style={{
                  width: 142, height: 40, border: '1px solid rgba(85,123,241,0.1)', padding: '0 16px', fontSize: 14, textAlign: 'right'
                }} className=" rounded-lg" value={""} onUserInput={function (input: string): void {
                  throw new Error("Function not implemented.");
                } } />
              </div>
              <div className="w-[100px] pl-[45px]">
                <div className="text-[16px] font-fsemibold">x</div>
              </div>
              <div className="w-[142px] flex items-center">
                <Input style={{
                  width: 142, height: 40, border: '1px solid rgba(85,123,241,0.1)', padding: '0 16px', fontSize: 14, textAlign: 'right'
                }} className=" rounded-lg" value={""} onUserInput={function (input: string): void {
                  throw new Error("Function not implemented.");
                } } />
              </div>
              <div className="w-[110px] pl-[50px]">
                <div className="text-[16px] font-fsemibold">=</div>
              </div>
              <div className="w-[142px] shrink-0">
                <div className="text-[16px] font-fsemibold text-right">1.5</div>
              </div>
              <div className="w-[104px] pl-[50px]"></div>
            </div> */}
            {
              dataList.map((item, index) => {
                return (
                  <div key={index} className="h-[60px] text-[14px] flex items-center text-[rgba(0,0,0,1)] font-fsemibold award-table-item">
                    <div className="w-[101px] pl-5">{index + 1}</div>
                    <div className="w-[142px] flex items-center">
                      <Input style={{
                        width: 142, height: 40, border: '1px solid rgba(85,123,241,0.1)', padding: '0 16px', fontSize: 14, textAlign: 'right'
                      }} 
                        className=" rounded-lg" 
                        value={item.amount} 
                        onUserInput={ value => {
                          handleAmountInput(value, index)
                        }} />
                    </div>
                    <div className="w-[100px] pl-[45px]">
                      <div className="text-[16px] font-fsemibold">x</div>
                    </div>
                    <div className="w-[142px] flex items-center">
                      <Input style={{
                        width: 142, height: 40, border: '1px solid rgba(85,123,241,0.1)', padding: '0 16px', fontSize: 14, textAlign: 'right'
                      }} 
                        className=" rounded-lg" 
                        value={item.size} 
                        onUserInput={ value => {
                          handleSizeInput(value, index)
                        }} />
                    </div>
                    <div className="w-[110px] pl-[50px]">
                      <div className="text-[16px] font-fsemibold">=</div>
                    </div>
                    <div className="w-[142px] shrink-0">
                      <div className="text-[16px] font-fsemibold text-right">
                        {item.amount * item.size}
                      </div>
                    </div>
                    <div className="w-[104px] pl-[50px]">
                      {
                        index > 0 && 
                        <div className="cursor-pointer"
                          onClick={e => {
                            e.stopPropagation()
                            handleDelDataItem(index)
                          }}
                        >
                          <LazyImage src="/images/campaign/del.svg" />
                        </div>
                      }
                      
                    </div>
                  </div>
                )
              })
            }
            
          </div>
          <div className="bg-[rgba(107,190,225,0.02)] h-[60px] flex items-center">
            <div className="pl-4 cursor-pointer"
              onClick={e => {
                e.stopPropagation()
                handleAddDataItem()
              }}
            >
              <LazyImage src="/images/campaign/add.svg" />
            </div>
          </div>
        </div>
        <div className='p-5 rounded-xl bg-[rgba(85,123,241,0.06)] w-[225px] min-h-[277px] shrink-0 relative'>
          <LazyImage src='/images/campaign/bg2.png' className='w-[148px] h-[163px] absolute top-0 right-0' />
          <div className=' relative z-10 flex flex-col justify-between h-full'
          >
            <ItemTitle>Summary</ItemTitle>
            <div className=''>
              <div className='text-[14px] text-[rgba(0,0,0,0.6)] font-fnormal flex items-center flex-wrap'>
                {
                  dataList.map((item, index) => {
                    return (
                      <div key={index}>
                        <span className='text'>1.5</span>
                        {
                          index === dataList.length - 1 ? <span className='text-[18px] ml-4'>=</span> : <span className='text-[16px] mx-2'>+</span>
                        }
                        
                      </div>
                    )
                  })
                }
                {/* <span className='text'>1.5</span>
                <span className='text-[16px] mx-2'>+</span>
                <span className='text'>1.5</span>
                <span className='text-[16px] mx-2'>+</span>
                <span className='text'>1.5</span>
                <span className='text-[18px] ml-4'>=</span> */}
              </div>
              <div className='text-[45px] font-fsemibold mt-5'>
                {totalAmount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ItemBox>
  )
}

export default AwardList