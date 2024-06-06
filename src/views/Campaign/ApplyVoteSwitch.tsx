import React, { useCallback, useMemo, useState } from "react";

const ApplyVoteSwitch = ({
  onChange,
  value
}: {
  onChange?: (isVote: boolean) => void
  value?: boolean
}) => {
  // const [isVote, setIsVote] = useState(false)
  const isVote = useMemo(() => {
    return !value
  }, [value])
  return (
    <div className="flex items-center justify-between px-3 rounded-md bg-[rgba(85,123,241,0.05)] w-[118px] h-[41px]">
      <span className="green-text text-[16px] font-fmedium">{isVote ? 'Vote' : 'Apply'}</span>
      <div 
        onClick={e => {
          e.stopPropagation()
          onChange && onChange(!value)
        }}
        className={`
          w-[36px] h-[20px] relative cursor-pointer
          ${isVote ? 'green-bg2' : 'green-bg1'}
        `}>
        <div className={`
          absolute bg-white rounded w-[14px] h-[14px] top-[3px] transition-all
          ${isVote ? 'left-1 right-auto' : ' left-auto right-1'}
        `}></div>
      </div>
    </div>
  )
}

export default ApplyVoteSwitch