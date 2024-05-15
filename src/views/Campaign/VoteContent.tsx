
import React, { useEffect, useState } from "react";
import { LabelText } from "./styleds";
import { ICampaignApplyVote } from "../../state/campaign/actions";
import LazyImage, { LazyImage2 } from "../../components/LazyImage";

const VoteItem = ({
  voteData,
  selected,
  onClick,
  from
}: {
  voteData: ICampaignApplyVote,
  selected: boolean,
  onClick?: (voteData: ICampaignApplyVote) => void,
  from?: string
}) => {
  return (
    <div className="">
      <LazyImage src="/images/campaign/demo.png" className="w-[147px] h-[197px]" />
      <div className="flex justify-center mt-[10px]">
        {
          from === 'project' ? 
          <>
            <div
              className="flex items-center"
            >
              ({voteData.voteCount})
            </div>
          </> :
          <div
            className=" cursor-pointer flex items-center"
            onClick={e => {
              e.stopPropagation()
              onClick && onClick(voteData)
            }}
          >
            <LazyImage2 src={selected ? '/images/campaign/selected.svg' : '/images/campaign/select.svg'} />
            ({voteData.voteCount})
          </div>
        }
        
      </div>
    </div>
  )
}


const VoteContent = ({
  applyVoteList,
  onSelect,
  from
}: {
  applyVoteList: ICampaignApplyVote[],
  onSelect?: (index: number) => void,
  from?: string
}) => {
  const [currentIndex, setCurrentIndex] = useState(-1)
  useEffect(() => {
    onSelect && onSelect(currentIndex)
  }, [currentIndex])
  return (
    <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 p-5">
      <LabelText>Vote</LabelText>
      <div className="mt-4">
        <div className=" grid grid-cols-5 gap-x-[88px] gap-y-[20px]">
          {
            applyVoteList.map((item, index) => {
              return (
                <VoteItem 
                  from={from}
                  key={item.arwId} voteData={item} selected={currentIndex === index} onClick={(voteData) => {
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
  )
}

export default VoteContent