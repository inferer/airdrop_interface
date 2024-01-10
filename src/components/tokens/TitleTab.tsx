import { useRouter } from "next/router";
import React from "react";

const TitleTab = () => {
  const router = useRouter()
  const isRewards = router.pathname === "/rewards"

  const handleSwitchTab = (action: string) => {
    router.push(`/${action}`)
  }

  return (
    <div className="flex text-[rgba(0,0,0,0.3)] text-[18px] font-fsemibold">
      <div className={` cursor-pointer ${isRewards ? 'text-[#000]' : ' '}`}
        onClick={e => {
          e.stopPropagation()
          handleSwitchTab('rewards')
        }}
      >
        Rewards
      </div>
      <div className={`ml-5 cursor-pointer ${!isRewards ? 'text-[#000]' : ' '}`}
        onClick={e => {
          e.stopPropagation()
          handleSwitchTab('consumption')
        }}
      >
        Consumption
      </div>
    </div>
  )
}

export default TitleTab