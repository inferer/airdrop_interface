import { IAirdrop } from "../../state/airdrop/actions";
import React, { useMemo } from "react";
import { FlexCenter, LabelText } from "./styleds";
import CurrencyLogo from "../../components/CurrencyLogo";
import LazyImage from "../../components/LazyImage";
import { formatStringNumber, openBrowser, shortenAddress } from "../../utils";
import { Currency } from "@uniswap/sdk";
import { useRouter } from "next/router";
import { FundToken, FundToken2 } from "../Project/Ongoing";

const ProgressItem = ({
  amount,
  token
}: {
  amount: string,
  token: Currency
}) => {
  return (
    <div className="flex">
      <div className="flex items-center mt-3 rounded-lg border border-[rgba(85,123,241,0.10)] h-[36px] px-[10px]">
        <div className=" font-semibold text-[16px]">{amount}</div>
        <div className=" font-semibold text-[16px] mx-2">x</div>
        <div className="px-2 py-[1px] rounded flex items-center" style={{background: 'linear-gradient(96deg, rgba(63, 60, 255, 0.05) 0%, rgba(107, 190, 225, 0.05) 101.71%)'}}>
          <CurrencyLogo type="project" currency={token} size="20px" />
          <div className="blue-text text-[16px] font-medium ml-1">{token?.symbol}</div>
        </div>
      </div>
    </div>
  )
}

const AirdropInfo = ({ 
  airdrop,
  from = 'project',
  confirm = false,
  taskList
}: {
  airdrop: IAirdrop,
  from?: string,
  confirm?: boolean,
  taskList?: any[]
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
  
  const router = useRouter()

  const landingPage = useMemo(() => {
    if (from === 'project' || confirm) return contentJson.landingPage + '?airdropId=' + airdrop.airdropId
    return contentJson.landingPage + '?taskId=' + router.query.taskId
  }, [from, confirm, airdrop, contentJson])

  const action = router.query.action && router.query.action[0]

  const label3 = useMemo(() => {
    if (airdrop.isExpired) return 'Outdated Value'
    if (action === 'completed') return 'Returned Value'
    if (action === 'ongoing') return 'Remaining Value'

  }, [action, airdrop])

  const filterTaskList = useMemo(() => {
    return taskList?.filter(task => task.completed)
  }, [taskList])
  
  const ongoing = useMemo(() => {
    return !airdrop.completed
  }, [airdrop])

  return (
    <div className="">
      <div className="h-[171px] rounded-xl border border-[rgba(85, 123, 241, 0.1)] overflow-hidden">
        <div className="h-[64px] w-full flex items-center bg-[rgba(85,123,241,0.10)] pl-5 text-[24px] font-fsemibold"> {airdrop.name}</div>
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
                  {
                    from === 'project' ?
                    <div className="px-2 py-[1px] ml-[11px] rounded flex items-center" style={{background: 'linear-gradient(96deg, rgba(63, 60, 255, 0.05) 0%, rgba(107, 190, 225, 0.05) 101.71%)'}}>
                      {
                        airdrop.labelToken && <CurrencyLogo type="project" currency={airdrop.labelToken} size="20px" />
                      }
                      <div className="blue-text text-[16px] font-medium ml-1">{airdrop.labelToken?.symbol}</div>
                    </div> : 
                    <div className='bg-[#F2F9F3] rounded flex items-center py-[1px] px-2 ml-[11px]'>
                      {
                        airdrop.labelToken && <CurrencyLogo type="confirm" currency={airdrop.labelToken} size={'20px'} />
                      }
                      <div className=' font-fmedium text-[#A1CEA8] ml-1'>
                        {airdrop.labelToken?.symbol}
                      </div>
                    </div>
                  }
                  
                </div>
              </div>
            </div>
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText>Fund</LabelText>
              <div className="mt-3 flex">
                <FundToken2 airdrop={airdrop} from={from} />
                {/* <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                  <div className=" text-[16px] font-fsemibold mr-1">
                    {formatStringNumber(airdrop.offerLocked)}
                  </div>
                  {
                    airdrop.offerToken && <CurrencyLogo currency={airdrop.offerToken} size={'20px'} />
                  }
                  
                </div> */}
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
        <LabelText>Contract</LabelText>
        <div className="mt-4">
          <div className=" grid grid-cols-3 rounded-lg bg-[rgba(85,123,241,0.04)] py-[13px]">
            <div className="pl-5">
              <LabelText>Chain</LabelText>
              <div className="flex items-center mt-3 ">
                <LazyImage src="/images/airdrop/chain_airdrop.svg" />
                <div className="text-[14px] font-fmedium ml-2">{contentJson.chain === 'localtest' ? 'Airdrop' : contentJson.chain}</div>
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
          {
            contentJson.parameter.length > 0 && 
            <div className="mt-5">
              <LabelText>Parameter</LabelText>
              <div className=" grid grid-cols-2 mt-4 rounded-lg overflow-hidden">
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
                
              </div>
            </div>
          }
          
        </div>
        
        <div className="mt-5">
          <LabelText>Landing Page</LabelText>
          <div className="flex">
            <div className="h-[44px] flex items-center mt-3 px-4 bg-[rgba(247,100,135,0.015)] cursor-pointer rounded-lg"
              onClick={e => {
                e.stopPropagation()
                openBrowser(landingPage)
              }}
            >
              <LazyImage src="/images/airdrop/landing.svg" />
              <div className="text-[14px] font-fnormal mx-2">{landingPage}</div>
              
              <div className=" "
                
              >
                <LazyImage src="/images/airdrop/share6.svg" />
              </div>
            </div>
          </div>
        </div> 
        {
          confirm && 
          <div className="bg-[rgba(147,205,155,0.04)] rounded-xl p-3 mt-5 text-[rgba(147,205,155,0.80)]">
            <div className=" text-[14px] font-fsemibold leading-normal mb-2">
              Airdrop token would be issued from contract.
            </div>
            <div className="text-[13px] font-fnormal leading-4">
              Once you confirmed the airdrop, the alg-* token would be locked in protocol until the airdrop content gets done. And the alg-* token would be transformed into air-* token and transferred into your account for later trade in airdrop pools.
            </div>
          </div>
        }
        
      </div>
      {
        from === 'project' && 
        <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 py-5">
          <div className="text-[18px] font-semibold text-black mb-4 pl-5">Progress</div>
          <div className="">
            <div className=" grid grid-cols-4 gap-y-6">
              <div className="pl-5">
                <LabelText>Total Value</LabelText>
                <ProgressItem amount={formatStringNumber(airdrop.labelLocked)} token={airdrop.labelToken} />
              </div>
              <div className="pl-5 flex items-center">
                <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
                <div>
                  <LabelText>Consumed Value</LabelText>
                  <ProgressItem amount={formatStringNumber(airdrop.completedClaimed || '')} token={airdrop.labelToken} />
                </div>
              </div>
              {
                ongoing && 
                <div className="pl-5 flex items-center">
                  <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
                  <div>
                    <LabelText>Ongoing Value</LabelText>
                    <ProgressItem amount={formatStringNumber(String(Number(airdrop.claimed) - Number(airdrop.completedClaimed)))} token={airdrop.labelToken} />
                  </div>
                </div>
              }
              <div className="pl-5 flex items-center">
                <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
                <div>
                  <LabelText>{label3 || ''}</LabelText>
                  <ProgressItem amount={formatStringNumber(String(Number(airdrop.labelLocked) - Number(airdrop.claimed)))} token={airdrop.labelToken} />
                </div>
              </div>
              <div className="pl-5 flex items-center">
                {
                  !ongoing && <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
                }
                
                <div>
                  <LabelText>Executed Tasks</LabelText>
                  <div className="flex">
                    <div className="flex items-center mt-3 rounded-lg border border-[rgba(85,123,241,0.10)] h-[36px] px-[10px]">
                      <div className=" font-semibold text-[16px]">{filterTaskList ? filterTaskList.length : 0}</div>
                      <div className=" font-semibold text-[16px] mx-2">x</div>
                      <div className="ml-1">
                        <LazyImage src="/images/airdrop/tasks.svg" />
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      }
      
    </div>
  )
}

export default AirdropInfo