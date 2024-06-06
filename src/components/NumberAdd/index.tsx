
import React from "react";

export interface NumberAddProps {
  onPlus: () => void,
  onMinus: () => void
}

const NumberAdd = ({

}: NumberAddProps) => {
  return (
    <div className="w-5 h-6 rounded-sm bg-[rgba(85,123,241,0.08)]">
      
    </div>
  )
}

export default NumberAdd