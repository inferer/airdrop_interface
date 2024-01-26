import { useMaxUnits, useUpdateMaxUnits } from "../../state/airdrop/hooks";
import LazyImage from "../../components/LazyImage";
import React, { useCallback, useState } from "react";

const ScoreItem = ({
  active,
  onClick
}: { active?: boolean, onClick?: () => void}) => {
  return (
    <div 
      onClick={e => {
        e.stopPropagation()
        onClick && onClick()
      }}
      className={`score-item ${active ? 'bg-[rgba(73,91,255,0.30)] active' : 'bg-[#FAFAFA]'}  w-[82px] h-3 rounded-sm mr-1 cursor-pointer`}>

    </div>
  )
}

const Units = () => {
  const [showTip, setShowTip] = useState(false)
  const [unit, setUnit] = useState(1)

  const updateMaxUnits = useUpdateMaxUnits()
  const maxUnits = useMaxUnits()

  const handleOnClick = useCallback((_unit: number) => {
    if (_unit <= unit && _unit > 1) {
      setUnit(_unit - 1)
      updateMaxUnits(_unit - 1)
    } else {
      setUnit(_unit)
      updateMaxUnits(_unit)
    }
    
  }, [unit])
  return (
    <div className=" border border-[#F5F5F5] rounded-xl px-4 h-[58px] relative">
      <div className={`bg-[#33383E] rounded px-3 py-[5px] text-[11px] font-dmedium leading-5 text-[rgba(232,234,236,1)] absolute left-0 bottom-[90%] ${showTip ? '' : 'hidden'}`}>
      Max units refer to the airdrop task workload.
      </div>
      <div className="flex items-center h-full">
        <LazyImage src="/images/airdrop/unit.svg" />
        <div className="text-[rgba(0,0,0,0.40)] text-[16px] font-fsemibold ml-1 cursor-pointer"
          onMouseOver={e => {
            e.stopPropagation()
            setShowTip(true)
          }}
          onMouseLeave={e => {
            e.stopPropagation()
            setShowTip(false)
          }}
        >Max units</div>
        <div className="flex items-center ml-[21px]">
          <ScoreItem 
            active={maxUnits >= 1} 
            onClick={() => {
              handleOnClick(1)
            }}
          />
          <ScoreItem
            active={maxUnits >= 2}  
            onClick={() => {
              handleOnClick(2)
            }}
          />
          <ScoreItem 
            active={maxUnits >= 3} 
            onClick={() => {
              handleOnClick(3)
            }}
          />
        </div>
        <div className=" text-base font-fbold text-[#495BFF] ml-3">{maxUnits}x</div>
      </div>
    </div>
  )
}

export default Units