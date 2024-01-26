import React, { useState } from "react";

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

  const [showTip, setShowTip] = useState(false)

  return (
    <div className=" border border-[#F5F5F5] rounded-xl px-4 h-[58px] relative">
      <div className={`bg-[#33383E] rounded px-3 py-[5px] w-[267px] text-[11px] font-dmedium leading-5 text-[rgba(232,234,236,1)] absolute left-0 bottom-[90%] ${showTip ? '' : 'hidden'}`}>
      Inferer score is calculated based on on-chain data, 
      and utilized as identity analysis standard.
      More info on https://docs.inferer.xyz.
      </div>
      <div className="flex items-center h-full cursor-pointer">
        <div className="text-[rgba(0,0,0,0.40)] text-[16px] font-fsemibold"
          onMouseOver={e => {
            e.stopPropagation()
            setShowTip(true)
          }}
          onMouseLeave={e => {
            e.stopPropagation()
            setShowTip(false)
          }}
        >Score</div>
        <div className="flex items-center ml-[70px]">
          <ScoreItem active={score >= 1} />
          <ScoreItem active={score > 1.25} />
          <ScoreItem active={score > 1.5} />
          <ScoreItem active={score > 1.75} />
        </div>
        <div className={`text-base font-fbold ml-3 ${score > 0 ? 'text-[#49BCFF]' : 'text-[rgba(0,0,0,0.30)]'}`}>{score}x</div>
      </div>
    </div>
  )
}

export default Score