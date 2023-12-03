import LazyImage from "../../components/LazyImage";
import React from "react";


const Select: React.FC<{
  title?: string
}> = ({
  title
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-[rgba(85,123,241,0.02)] rounded-[8px] cursor-pointer min-w-[120px]">
      <span className="mr-5">{title}</span>
      <LazyImage src="/images/airdrop/arrow-down.svg" />
    </div>
  )
}

export default Select