import { IAirdrop } from "../../state/airdrop/actions";
import React, { useMemo } from "react";
import { FlexCenter, LabelText } from "./styleds";
import CurrencyLogo from "../../components/CurrencyLogo";
import LazyImage from "../../components/LazyImage";
import { openBrowser, shortenAddress } from "../../utils";

const AirdropInfo = ({ 
  airdrop
}: {
  airdrop: IAirdrop
}) => {

  const contentJson = useMemo(() => {
    let obj: any = {
      contractAddress: '',
      functionName: '',
      chain: '',
      parameter: [],
      landingPage: ''
    }
    if (airdrop.content) {
      const contentArr = airdrop.content.split('.')
      obj.contractAddress = contentArr[0]
      obj.functionName = contentArr[1]
    }
    obj.chain = airdrop.chain ?? ''
    obj.landingPage = airdrop.landingPage ?? ''
    obj.parameter = airdrop.parameterInfo ?? []

    return obj
  }, [airdrop])
  
  return (
    <div className="">
      <div className="h-[171px] rounded-xl border border-[rgba(85, 123, 241, 0.1)] overflow-hidden">
        <div className="h-[64px] w-full flex items-center bg-[rgba(85,123,241,0.02)] pl-5 text-[24px] font-fsemibold"> {airdrop.name}</div>
        <div className="grid grid-cols-4 mt-5">
          <div className="pl-5">
            <LabelText>Pool</LabelText>
            <div className="mt-3 flex">
              <div className="text-[rgba(63,60,255,0.8)] text-[16px] font-fmedium rounded-lg bg-[rgba(63,60,255,0.05)] px-2 h-[35px] flex items-center">
                <FlexCenter>{airdrop.label}</FlexCenter>
              </div>
            </div>
            
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText>Reward</LabelText>
              <div className="mt-3 flex">
                <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                  <div className=" text-[16px] font-semibold">
                    {airdrop.unit}  x
                  </div>
                  {/* {
                    airdrop.offerToken?.symbol && <div className="text-[16px] ml-2">{airdrop.offerToken?.symbol}</div>
                  } */}
                  <div className='bg-[#F2F9F3] rounded flex items-center py-[1px] px-2 ml-[11px]'>
                    {
                      airdrop.labelToken && <CurrencyLogo currency={airdrop.labelToken} size={'20px'} />
                    }
                    
                    <div className=' font-fmedium text-[#A1CEA8] ml-1'>
                      {airdrop.labelToken?.symbol}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText>Fund</LabelText>
              <div className="mt-3 flex">
                <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                  <div className=" text-[16px] font-fsemibold mr-1">
                    {airdrop.offerLocked}
                  </div>
                  {
                    airdrop.offerToken && <CurrencyLogo currency={airdrop.offerToken} size={'20px'} />
                  }
                  
                  {/* {
                    airdrop.offerToken?.symbol && <div className="text-[16px] ml-2">{airdrop.offerToken?.symbol}</div>
                  } */}
                </div>
              </div>
            </div>
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText>Expire On</LabelText>
              <div className="mt-3 flex">
                <div className="flex items-baseline font-fnormal">
                  <div className=" text-[16px] text-[rgba(0,0,0,0.4)]">
                    {airdrop.expireOn}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 p-5">
        <div className="text-[18px] font-semibold text-black mb-4">Contract task info</div>
        <div className="">
          <div className=" grid grid-cols-3 rounded-lg bg-[rgba(85,123,241,0.04)] py-[13px]">
            <div className="pl-5">
              <LabelText>Chain</LabelText>
              <div className="flex items-center mt-3 ">
                <LazyImage src="/images/airdrop/chain_airdrop.svg" />
                <div className="text-[14px] font-fmedium ml-2">{contentJson.chain}</div>
              </div>
            </div>
            <div className="pl-5 flex items-center">
              <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
              <div>
                <LabelText>Contract</LabelText>
                <div className="flex items-center mt-3">
                  <LazyImage src="/images/airdrop/contract_logo.svg" />
                  <div className="text-[14px] font-fnormal mx-2">{shortenAddress(contentJson.contractAddress)}</div>
                  <LazyImage src="/images/airdrop/contract_verify.svg" />
                </div>
              </div>
            </div>
            <div className="pl-5 flex items-center">
              <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
              <div>
                <LabelText>Function</LabelText>
                <div className="flex items-center mt-3">
                  <LazyImage src="/images/airdrop/fun.svg" />
                  <div className="text-[14px] font-fmedium ml-2">{contentJson.functionName}</div>
                </div>
              </div>
              
            </div>
          </div>
          <div className="mt-5">
            <LabelText>Parameter</LabelText>
            <div className=" grid grid-cols-2 mt-4">
              {
                contentJson.parameter.map((item: any, index: number) => {
                  return (
                    <div key={item.name} className={`flex items-center h-[36px] bg-[rgba(85,123,241,0.02)] ${ (index % 3 === 0 || index % 3 === 1) && index !== 1 && index !== 6 ? 'bg0006' : ''}`}>
                      <div className='flex items-center justify-between w-[261px] shrink-0 bg_left pl-5 h-full'>
                        <div className="flex items-center">
                          <LazyImage src='/images/airdrop/param.svg' />
                          <div className="w-[1px] h-[12px] mx-2 bg-[rgba(85,123,241,0.15)]"></div>
                          <div className='text-[13px] text-[rgba(0,0,0,0.60)] pl-2 pr-4'>{item.name} ({item.type})</div>
                        </div>
                        <div className="w-[1px] h-[12px] mr-4 bg-[rgba(85,123,241,0.15)]">&nbsp;</div>
                      </div>
                      <div className='w-[296px] shrink-0 pr-4 flex items-center h-[36px] text-[13px] text-[rgba(0,0,0,0.40)] bg_right'>
                        <div className="truncate">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              
              {/* <div className='flex justify-between items-center mt-3'>
                <div className=' w-full flex items-center'>
                  <LazyImage src='/images/airdrop/param.svg' />
                  <div className='text-[13px] text-[rgba(0,0,0,0.60)] pl-2 pr-4'>_maxDepositsCount (uint256)</div>
                </div>
                <div className='w-[300px] shrink-0 rounded-lg border border-[rgba(85,123,241,0.10)] px-3 flex items-center h-[32px]'>
                  <TextInput  
                    color='rgba(0,0,0,0.40)'
                    fontSize='13px'
                    value={''} 
                    onUserInput={value => {

                    }} 
                  />
                </div>
              </div> */}
              
            </div>
          </div>
        </div>
        
        <div className="mt-5">
          <LabelText>Landing Page</LabelText>
          <div className="flex">
            <div className="h-[44px] flex items-center mt-3 px-4 border border-[rgba(85,123,241,0.10)] rounded-xl">
              <LazyImage src="/images/airdrop/landing.svg" />
              <div className="text-[14px] font-fnormal mx-2">{contentJson.landingPage}</div>
              <div className=" cursor-pointer"
                onClick={e => {
                  e.stopPropagation()
                  openBrowser(contentJson.landingPage)
                }}
              >
                <LazyImage src="/images/airdrop/share6.svg" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[rgba(147,205,155,0.04)] rounded-xl p-3 mt-5 text-[rgba(147,205,155,0.80)]">
          <div className=" text-[14px] font-fsemibold leading-normal mb-2">
            Airdrop token would be issued from contract.
          </div>
          <div className="text-[13px] font-fnormal leading-4">
            Once you confirmed the airdrop, the alg-* token would be locked in protocol until the airdrop content gets done. And the alg-* token would be transformed into air-* token and transferred into your account for later trade in airdrop pools.
          </div>
        </div>
      </div>
    </div>
  )
}

export default AirdropInfo