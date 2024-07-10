'use client';
import { ICampaign, ICampaignApplyVote } from "../../state/campaign/actions";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlexCenter, LabelText, LabelText0, LabelText2 } from "./styleds";
import CurrencyLogo from "../../components/CurrencyLogo";
import LazyImage from "../../components/LazyImage";
import { formatStringNumber, openBrowser, shortenAddress } from "../../utils";
import { useRouter } from "next/router";
import { useIrysQuery } from "../../hooks/useIry";
import InputNumber from "../../components/NumericalInput";


const CampaignProgress = ({ 
  campaign,
  from = 'project',
  confirm = false,
  isVote,
  onBonusChange,
  userApply,
  applyVoteList = []
}: {
  campaign: ICampaign,
  from?: string,
  confirm?: boolean,
  isVote?: boolean,
  onBonusChange?: (value: string) => void,
  userApply?: ICampaignApplyVote,
  applyVoteList?: ICampaignApplyVote[]
}) => {

  
  const voteTotal = useMemo(() => {
    // @ts-ignore
    if (!applyVoteList && applyVoteList?.length <= 0) {
      return 0
    } else {
      return applyVoteList.reduce((total, item) => total + Number(item.voteCount), 0)
    }
  }, [applyVoteList])
  const tierTotal = useMemo(() => {
    const awardList = campaign.awardList || []
    return awardList.reduce((total, item) => total + Number(item.a), 0)
  }, [campaign])

  const [awardList2, setAwardList2] = useState<{a: number, s: number, applyList: ICampaignApplyVote[]}[]>([])

  useEffect(() => {
    const awardList = campaign.awardList || []
    let applyNo = 0;
    let _break = false
    let _awardList2: {a: number, s: number, applyList: ICampaignApplyVote[]}[] = []
    let _applyVoteList: ICampaignApplyVote[] = [ ...applyVoteList ]
    for (let i = 1; i < _applyVoteList.length;i++){
      const temp = _applyVoteList[i];
      let j = i;
      while( (j >= 1) && (temp.voteCount > _applyVoteList[j-1].voteCount)){
        _applyVoteList[j] = _applyVoteList[j-1];
        j--;
      }
      _applyVoteList[j] = temp;
    }

    for (let i = 0; i < awardList.length; i++) {
      const _a = awardList[i].a
      const _s = awardList[i].s
      _awardList2[i] = {...awardList[i], applyList: []}
      for (let j = 0; j < _s; j++) {
        if (applyNo < _applyVoteList.length) {
          _awardList2[i].applyList.push(_applyVoteList[applyNo])
          applyNo++
        } else {
          _break = true
          break
        }
      }
      if (_break) {
        break
      }
    }
    setAwardList2(_awardList2)
  }, [campaign, applyVoteList])
  return (
    <div className="mt-5">
      <div className="h-[335px] rounded-xl border border-[rgba(85, 123, 241, 0.1)] overflow-hidden">
        <div className="p-5">
          <LabelText0>Progress</LabelText0>
        </div>
        
        <div className="grid grid-cols-4 mt-5">
          <div className="pl-5">
            <LabelText2>Tiers</LabelText2>
            <div className="mt-3 flex">
              <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                <div className=" text-[16px] font-fsemibold mr-1">
                  {campaign.awardList?.length}
                </div>
              </div>
            </div>
            
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText2>Award Count</LabelText2>
              <div className="mt-3 flex">
                <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                  <div className=" text-[16px] font-fsemibold mr-1">
                    {campaign.isExpired ? (applyVoteList.length <= tierTotal ? applyVoteList.length : tierTotal) : 'NA'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText2>Status</LabelText2>
              <div className="mt-3 flex">
                <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                  <div className=" text-[16px] font-fsemibold mr-1">
                    {campaign.isExpired ? 'Completed' : campaign.isApplyExpired ? 'Vote' : 'Apply'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText2>Protocol Distribution</LabelText2>
              <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px] shrink-0 mt-3">
                <div className=" text-[16px] font-semibold shrink-0">
                  { from === 'project' ? formatStringNumber(campaign.labelLocked) : isVote ? 1 : 5} ×
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
        <div className="grid grid-cols-4 mt-6">
          <div className="pl-5 flex items-center">
            <div>
              <LabelText2>Apply Count</LabelText2>
              <div className="mt-3 flex">
                <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                  <div className=" text-[16px] font-fsemibold mr-1">
                    {applyVoteList.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pl-5 flex items-center">
            <div className="w-[1px] bg-[rgba(85,123,241,0.1)] h-[43px] mr-5"></div>
            <div>
              <LabelText2>Vote Count</LabelText2>
              <div className="mt-3 flex">
                <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
                  <div className=" text-[16px] font-fsemibold mr-1">
                    {voteTotal}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default CampaignProgress