
import React from "react";
import LazyImage from "../LazyImage";

export interface NumberAddProps {
  onPlus?: () => void,
  onMinus?: () => void
}

const NumberAdd = ({
  onPlus,
  onMinus
}: NumberAddProps) => {
  return (
    <div className="w-5 h-6 rounded-sm bg-[rgba(85,123,241,0.08)] shrink-0">
      <div
        className=" cursor-pointer p-[5px] pb-0"
        onClick={e => {
          e.stopPropagation()
          onPlus && onPlus()
        }}
      >
        <LazyImage src="/images/campaign/plus.svg" className="w-[10px] h-[5px]" />
      </div>
      <div
        className=" cursor-pointer p-[5px] pt-0"
        onClick={e => {
          e.stopPropagation()
          onMinus && onMinus()
        }}
      >
        <LazyImage src="/images/campaign/minus.svg" className="mt-[5px] w-[10px] h-[5px]" />
      </div>
      
    </div>
  )
}

export default NumberAdd