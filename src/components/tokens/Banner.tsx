import { useRouter } from "next/router";
import React, { useCallback } from "react";
import LazyImage, { LazyImage2 } from "../LazyImage";
import { useIsRoleProjectMode, useUserAction } from "../../state/user/hooks";
import { UserAction } from "../../constants";

const Banner = () => {
  const router = useRouter()
  const isRewards = router.pathname === "/rewards"
  const isProjectMode = useIsRoleProjectMode()
  const { userAction, setUserAction }  = useUserAction()

  const handleTab = useCallback((action: UserAction) => {
    if (action === UserAction.CREATE) {
      setUserAction(action)
      router.push('/swap')
    }
    
    if (action === UserAction.USER_SWAP) {
      setUserAction(action)
      router.push('/swap')
    }
  }, [setUserAction])

  return (
    <div className="mt-5 relative">
      <div className="w-[568px] h-[135px]">
      {
        isProjectMode ? <LazyImage2 src="/images/airdrop/project_banner.png" className="w-[568px]" /> : <LazyImage2 src="/images/airdrop/user_banner.png" className="w-[568px]" />
      }
      </div>
      
      <div className=" absolute left-0 bottom-0 w-full h-full flex justify-center flex-col">
        <div className="flex items-center pl-10">
          {
            isRewards ? <LazyImage2 src="/images/airdrop/label_icon.svg" className="" /> : <LazyImage2 src="/images/airdrop/usdt_icon.svg" className="" />
          }
          
        </div>
        <div className="flex justify-end text-black font-fsemibold text-[20px] pb-[10px] pr-[28px] absolute right-0 bottom-0">
          {
            isProjectMode ?
            <>
              <div className=" cursor-pointer"
                onClick={e => {
                  e.stopPropagation()
                  handleTab(UserAction.CREATE)
                }}
              >Create</div>
            </> :
            <>
              <div className=" cursor-pointer"
                onClick={e => {
                  e.stopPropagation()
                  handleTab(UserAction.USER_SWAP)
                }}
              >Swap</div>
              <div className=" cursor-pointer ml-5"
                onClick={e => {
                  e.stopPropagation()
                  // handleTab(UserAction.USER_SWAP)
                }}
              >Withdraw</div>
            </>
          }
          
        </div>
      </div>
    </div>
  )
}

export default Banner