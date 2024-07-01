
import React, { useEffect, useMemo, useState } from "react";
import { LabelText } from "./styleds";
import { ICampaign, ICampaignApplyVote } from "../../state/campaign/actions";
import LazyImage, { LazyImage2 } from "../../components/LazyImage";
import { getIryPath, openId } from "../../utils/iry";
import { openBrowser, shortenAddress } from "../../utils";
import { Token } from "@uniswap/sdk";
import CurrencyLogo from "../../components/CurrencyLogo";
import useCopyClipboard from "../../hooks/useCopyClipboard";
import { Tooltip2 } from "../../components/Tooltip";

const VoteItem = ({
  offerToken,
  voteData,
  selected,
  onClick,
  from,
  total,
  isExpired,
  amount
}: {
  offerToken: Token
  voteData: ICampaignApplyVote,
  selected: boolean,
  onClick?: (voteData: ICampaignApplyVote) => void,
  from?: string
  total?: number
  isExpired?: boolean,
  amount?: number
}) => {
  const [ isCopied, staticCopy ] = useCopyClipboard()
  
  const perWidth = useMemo(() => {
    if (total && total > 0) {
      return (Number(voteData.voteCount) / total) * 100 + '%'
    } else {
      return '0%'
    }
  }, [total, voteData])

  const fileType = useMemo(() => {
    let _type = 'image'
    if (voteData?.arwId?.indexOf('zip-') === 0) {
      _type = 'zip'
    }
    return _type
  }, [voteData])
  const awardAmount = useMemo(() => {
    const _amount = amount || 0
    return _amount - _amount * (Number(voteData.bonus) / 100)
  }, [amount, voteData])

  return (
    <div className="">
      {
        fileType === 'image' && 
          <LazyImage src={voteData.arwId ? getIryPath(voteData.arwId) : "/images/campaign/demo.png" } className="w-[147px] h-[197px] rounded-lg " />
      }
      {
        fileType === 'zip' && 
          <div className="w-[147px] h-[197px] flex justify-center items-center cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              openBrowser(getIryPath(voteData.arwId))
            }}
          >
            <img src="/images/campaign/file.svg" alt="" className=" max-w-[100%] max-h-[100%] rounded" />
          </div>
      }

      <div className="mt-[15px]">
        <div className=" flex justify-center items-center">
          <span className="text-[14px] text-[rgba(123,120,255,1)] font-fnormal ">{voteData.voteCount}</span>
          <LazyImage src="/images/campaign/split.svg" className="mx-[2px]" />
          <span className="text-[12px] text-[rgba(0,0,0,0.4)] font-fnormal ">{total}</span>
        </div>
        <div className=" relative w-[147px] h-[4px] bg-[rgba(123,120,255,0.10)] rounded-[11px] mt-2">
          <div className="h-[4px] absolute left-0 top-0 bg-[rgba(123,120,255,1)] rounded-[11px]"
            style={{width: perWidth}}
          ></div>
        </div>
        <div className="flex items-center justify-center my-3 text-[15px] font-dnormal"
          onClick={e => {
            e.stopPropagation()
            staticCopy(voteData.applyUser || '')
          }}
        >
          {shortenAddress(voteData.applyUser)}
          <Tooltip2 text={isCopied ? 'Copied' : 'Copy' } >
            <LazyImage src="/images/airdrop/copy.svg" className="ml-2" />
          </Tooltip2>
          
        </div>
          
        <div className="flex items-center justify-center text-[14px] font-fsemibold">
          {awardAmount}
          {
            offerToken && <CurrencyLogo currency={offerToken} size={'16px'} style={{marginLeft: 4}} />
          }
        </div>
      </div>

    </div>
  )
}


const AwardContent = ({
  campaign,
  applyVoteList,
  onSelect,
  from
}: {
  campaign: ICampaign
  applyVoteList: ICampaignApplyVote[],
  onSelect?: (index: number) => void,
  from?: string
}) => {
  const [currentIndex, setCurrentIndex] = useState(-1)
  useEffect(() => {
    onSelect && onSelect(currentIndex)
  }, [currentIndex])

  const voteTotal = useMemo(() => {
    // @ts-ignore
    if (!applyVoteList && applyVoteList?.length <= 0) {
      return 0
    } else {
      return applyVoteList.reduce((total, item) => total + Number(item.voteCount), 0)
    }
  }, [applyVoteList])

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
    <>
      {
        applyVoteList?.length > 0 && 
        <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 p-5 pb-[200px]">
          <LabelText>Award</LabelText>
          {
            awardList2.map((awardItem, index) => {
              return (
                <div key={index}>
                  <div className="mt-[18px] text-[20px] font-fsemibold text-[rgba(0,0,0,0.5)]">Tier {index + 1}</div>
                  <div className="mt-6 flex justify-center">
                    <div className=" min-w-[484px] flex gap-x-[88px] gap-y-[20px] justify-center">
                      {
                        awardItem.applyList?.map((item, index) => {
                          return (
                            <VoteItem 
                              offerToken={campaign.offerToken}
                              isExpired={campaign.isExpired}
                              total={voteTotal}
                              from={from}
                              key={item.arwId} voteData={item} 
                              selected={currentIndex === index}
                              amount={awardItem.a}
                            />
                          )
                            
                        })
                      }
                    </div>
                  </div>
                </div>
              )
            })
          }

          {/* <div className="text-[20px] font-fsemibold text-[rgba(0,0,0,0.5)] mt-[35px]">Tier 2</div>
          <div className="mt-6 flex justify-center">
            <div className=" min-w-[484px] flex gap-x-[88px] gap-y-[20px] justify-center">
              {
                applyVoteList?.map((item, index) => {
                  return (
                    <VoteItem 
                      offerToken={campaign.offerToken}
                      isExpired={campaign.isExpired}
                      total={voteTotal}
                      from={from}
                      key={item.arwId} voteData={item} 
                      selected={currentIndex === index} 
                    />
                  )
                    
                })
              }
            </div>
          </div> */}
        </div>
      }
    </>
    
  )
}

export default AwardContent