
import React, { useEffect, useMemo, useState } from "react";
import { LabelText } from "./styleds";
import { ICampaign, ICampaignApplyVote } from "../../state/campaign/actions";
import LazyImage, { LazyImage2 } from "../../components/LazyImage";
import { getIryPath, openId } from "../../utils/iry";
import { openBrowser } from "../../utils";

const VoteItem = ({
  voteData,
  selected,
  onClick,
  from,
  total,
  isExpired
}: {
  voteData: ICampaignApplyVote,
  selected: boolean,
  onClick?: (voteData: ICampaignApplyVote) => void,
  from?: string
  total?: number
  isExpired?: boolean
}) => {
  
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
      <div className="flex justify-center mt-[10px]">
        {
          from === 'project' ? 
          <>
            
          </> :
          isExpired ? <></> :
          <div
            className=" cursor-pointer flex items-center"
            onClick={e => {
              e.stopPropagation()
              onClick && onClick(voteData)
            }}
          >
            <LazyImage2 src={selected ? '/images/campaign/selected.svg' : '/images/campaign/select.svg'} />
          </div>
        }
        
      </div>
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
      </div>

    </div>
  )
}


const VoteContent = ({
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

  return (
    <>
      {
        applyVoteList?.length > 0 && 
        <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 p-5">
          <LabelText>Vote</LabelText>
          <div className="mt-4">
            <div className=" grid grid-cols-5 gap-x-[88px] gap-y-[20px]">
              {
                applyVoteList?.map((item, index) => {
                  return (
                    <VoteItem 
                      isExpired={campaign.isExpired}
                      total={voteTotal}
                      from={from}
                      key={item.arwId} voteData={item} 
                      selected={currentIndex === index} 
                      onClick={(voteData) => {
                        if (currentIndex === index) {
                          setCurrentIndex(-1)
                        } else {
                          setCurrentIndex(index)
                        }
                      
                    }} />
                  )
                    
                })
              }
            </div>
          </div>
        </div>
      }
    </>
    
  )
}

export default VoteContent