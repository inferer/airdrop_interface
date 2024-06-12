'use client';
import { ICampaign, ICampaignApplyVote } from "../../state/campaign/actions";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlexCenter, LabelText } from "./styleds";
import CurrencyLogo from "../../components/CurrencyLogo";
import LazyImage from "../../components/LazyImage";
import { formatStringNumber, openBrowser, shortenAddress } from "../../utils";
import { Currency } from "@uniswap/sdk";
import { useRouter } from "next/router";
import { FundToken, FundToken2 } from "../CampaignList/Ongoing";
import { useIrysQuery } from "../../hooks/useIry";
import InputNumber from "../../components/NumericalInput";

import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';
import AwardListView from "./AwardListView";

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
  campaign,
  from = 'project',
  confirm = false,
  isVote,
  onBonusChange,
  userApply
}: {
  campaign: ICampaign,
  from?: string,
  confirm?: boolean,
  isVote?: boolean,
  onBonusChange?: (value: string) => void,
  userApply?: ICampaignApplyVote
}) => {

  const contentJson = useMemo(() => {
    let obj: any = {
      contractAddress: '',
      functionName: '',
      chain: '',
      parameter: [],
      landingPage: ''
    }
    if (campaign.content) {
      const contentArr = campaign.content.split('.')
      obj.contractAddress = contentArr[0]
      obj.functionName = contentArr[1]
    }
    obj.chain = campaign.chain ?? ''
    obj.landingPage = campaign.landingPage ?? ''

    return obj
  }, [campaign])
  
  const router = useRouter()

  const landingPage = useMemo(() => {
    if (from === 'project' || confirm) return contentJson.landingPage + '?campaignId=' + campaign.campaignId
    return contentJson.landingPage + '?campaignId=' + campaign.campaignId
  }, [from, confirm, campaign, contentJson])

  const action = router.query.action && router.query.action[0]

  const content = useIrysQuery(campaign.arwId)

  const [bonus, setBonus] = useState('')
  useEffect(() => {
    if (userApply) {
      setBonus(userApply.bonus)
      onBonusChange && onBonusChange(userApply.bonus)
    }
  }, [userApply, onBonusChange])
  return (
    <div className="">
      <div className="h-[171px] rounded-xl border border-[rgba(85, 123, 241, 0.1)] overflow-hidden">
        <div className="h-[64px] w-full flex items-center bg-[rgba(85,123,241,0.10)] pl-5 text-[24px] font-fsemibold"> {campaign.name}</div>
        <div className="grid grid-cols-5 mt-5">
          <div className="pl-5">
            <LabelText>Type</LabelText>
            <div className="mt-3 flex">
              <div className="text-[rgba(63,60,255,0.8)] text-[16px] font-fmedium rounded-lg bg-[rgba(63,60,255,0.05)] px-2 h-[35px] flex items-center capitalize">
                <FlexCenter>{campaign.action}</FlexCenter>
              </div>
            </div>
            
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText>Reward</LabelText>
              <div className="mt-3 flex">
                <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px] shrink-0">
                  <div className=" text-[16px] font-semibold shrink-0">
                    { from === 'project' ? formatStringNumber(campaign.labelLocked) : 1} ×
                  </div>
                  {
                    from === 'project' ?
                    <div className=" shrink-0 px-2 py-[1px] ml-[11px] rounded flex items-center" style={{background: 'linear-gradient(96deg, rgba(63, 60, 255, 0.05) 0%, rgba(107, 190, 225, 0.05) 101.71%)'}}>
                      {
                        campaign.labelToken && <CurrencyLogo type="campaign" currency={campaign.labelToken} size="20px" />
                      }
                      <div className="blue-text text-[16px] font-medium ml-1">{campaign.labelToken?.symbol}</div>
                    </div> : 
                    <div className='bg-[#F2F9F3] rounded flex items-center py-[1px] px-2 ml-[11px] shrink-0'>
                      {
                        campaign.labelToken && <CurrencyLogo type="campaign" currency={campaign.labelToken} size={'20px'} />
                      }
                      <div className=' font-fmedium text-[#A1CEA8] ml-1'>
                        {campaign.labelToken?.symbol}
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
                {/* <FundToken2 campaign={campaign} from={from} /> */}
                <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                  <div className=" text-[16px] font-fsemibold mr-1">
                    {formatStringNumber(campaign.offerLocked)}
                  </div>
                  {
                    campaign.offerToken && <CurrencyLogo currency={campaign.offerToken} size={'20px'} />
                  }
                  
                </div>
              </div>
            </div>
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText>Apply deadline</LabelText>
              <div className="mt-3 flex">
                <div className="flex items-baseline font-fnormal">
                  <div className=" text-[16px] text-[rgba(0,0,0,0.4)]">
                    {campaign.applyExpireOn}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText>Vote deadline</LabelText>
              <div className="mt-3 flex">
                <div className="flex items-baseline font-fnormal">
                  <div className=" text-[16px] text-[rgba(0,0,0,0.4)]">
                    {campaign.expireOn}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AwardListView dataList={campaign.awardList} offerToken={campaign.offerToken} />
      {
        from !== 'project' && !isVote &&
        <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 p-5">
          <LabelText>Bonus Settings</LabelText>
          <div className="mt-4 flex items-center">
            <div className=" font-fnormal">Bonus Percentage :</div>
            <div className="ml-5 rounded-lg border border-[rgba(85,123,241,0.10)]">
              <InputNumber style={{
                width: 48, height: 36, marginTop: 0, padding: '0 8px', fontSize: 14
              }} 
                className=" rounded-lg" 
                placeholder='0'
                value={bonus} 
                onUserInput={ value => {
                  setBonus(value)
                  onBonusChange && onBonusChange(value)
                }} />
            </div>
            <span className="ml-[6px]">%</span>
          </div>
          <div className="mt-5 text-[rgba(0,0,0,0.60)]">
            <div>Note:</div>
            Bonus percentage refers to the percentage of awards, which applier would like to distribute awards to their voters, once they won the campaign.
          </div>
        </div>
      }
      
      <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 p-5">
        <LabelText>Content</LabelText>
        <div className="mt-4">
          <div id="arwContent" style={{overflow: 'auto'}}>
            <MdPreview editorId={'preview-only'} modelValue={content} />
          </div>
          
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 p-5">
        <div className="">
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
      </div>
      
      
    </div>
  )
}

export default AirdropInfo