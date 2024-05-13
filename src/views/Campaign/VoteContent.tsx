
import React, { useEffect, useState } from "react";
import { LabelText } from "./styleds";
import { ICampaignApplyVote } from "../../state/campaign/actions";
import LazyImage, { LazyImage2 } from "../../components/LazyImage";

const VoteItem = ({
  voteData,
  selected,
  onClick
}: {
  voteData: ICampaignApplyVote,
  selected: boolean,
  onClick?: (voteData: ICampaignApplyVote) => void
}) => {
  return (
    <div className="">
      <LazyImage src="/images/campaign/demo.png" className="w-[147px] h-[197px]" />
      <div className="flex justify-center mt-[10px]">
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
      </div>
    </div>
  )
}


const VoteContent = ({
  applyVoteList,
  onSelect
}: {
  applyVoteList: ICampaignApplyVote[],
  onSelect?: (index: number) => void
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
              return <VoteItem key={item.arwId} voteData={item} selected={currentIndex === index} onClick={(voteData) => {
                if (currentIndex === index) {
                  setCurrentIndex(-1)
                } else {
                  setCurrentIndex(index)
                }
                
              }} />
            })
          }
        </div>
      </div>
    </div>
  )
}

export default VoteContent