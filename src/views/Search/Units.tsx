import LazyImage from "../../components/LazyImage";
import React from "react";

const ScoreItem = ({
  active
}: { active?: boolean}) => {
  return (
    <div className={`${active ? 'bg-[rgba(73,91,255,0.30)]' : 'bg-[#FAFAFA]'}  w-[82px] h-3 rounded-sm mr-1`}>

    </div>
  )
}

const Units = () => {
  return (
    <div className=" border border-[#F5F5F5] rounded-xl px-4 h-[58px]">
      <div className="flex items-center h-full">
        <LazyImage src="/images/airdrop/unit.svg" />
        <div className="text-[rgba(0,0,0,0.40)] text-[16px] font-fsemibold ml-1">Max units</div>
        <div className="flex items-center ml-[21px]">
          <ScoreItem active />
          <ScoreItem active />
          <ScoreItem />
        </div>
        <div className=" text-base font-fbold text-[#495BFF] ml-3">2x</div>
      </div>
    </div>
  )
}

export default Units