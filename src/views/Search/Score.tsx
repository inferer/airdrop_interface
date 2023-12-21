import React from "react";

const ScoreItem = ({
  active
}: { active?: boolean}) => {
  return (
    <div className={`${active ? 'bg-[rgba(73,188,255,0.30)]' : 'bg-[#FAFAFA]'}  w-[60px] h-3 rounded-sm mr-1`}>

    </div>
  )
}

const Score = ({
  score
}: { score: number}) => {
  return (
    <div className=" border border-[#F5F5F5] rounded-xl px-4 h-[58px]">
      <div className="flex items-center h-full">
        <div className="text-[rgba(0,0,0,0.40)] text-[16px] font-fsemibold">Score</div>
        <div className="flex items-center ml-[70px]">
          <ScoreItem active />
          <ScoreItem />
          <ScoreItem />
          <ScoreItem />
        </div>
        <div className=" text-base font-fbold text-[#49BCFF] ml-3">{score}x</div>
      </div>
    </div>
  )
}

export default Score