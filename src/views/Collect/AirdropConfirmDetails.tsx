
import React, { useEffect, useMemo, useState } from "react";
import { useAirdropList0 } from "../../state/airdrop/hooks";
import router, { useRouter } from 'next/router'
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { ButtonSwap, ButtonSwapUser } from "../../components/Button";
import { useIsRoleProjectMode } from "../../state/user/hooks";
import AirdropInfo from "../CollectRefer/AirdropInfo";

const AirdropConfirmDetails: React.FC<{

}> = () => {
  const isProjectMode = useIsRoleProjectMode()
  const router = useRouter()
  const { handleGetAirdropOne, handleGetAirdropUserConfirmed, airdropUserConfirmed } = useAirdropManager()

  useEffect(() => {
    if (router.query.action) {
      const id = router.query.action[1]
      handleGetAirdropOne(Number(id))
      handleGetAirdropUserConfirmed(Number(id))
    }
  }, [router.query])

  const airdrop = useAirdropList0(router.query?.action ? router.query?.action[1] as string : undefined)
  
  return (
    <div className="py-5 pt-0">
      <AirdropInfo airdrop={airdrop} from={isProjectMode ? 'project' : 'user'} taskList={airdropUserConfirmed} />
      <div className=" flex justify-center">
        <div className="w-[260px] mt-5">
          {
            isProjectMode ? 
            <ButtonSwap
              onClick={() => {
                router.back()
              }}
            >
              <div className="btn-text">
                Return
              </div>
            </ButtonSwap> :
            <ButtonSwapUser
              onClick={() => {
                router.back()
              }}
            >
              <div className="btn-text">
                Return
              </div>
            </ButtonSwapUser>
          }
          
        </div>
      </div>
    </div>
  )
}

export default AirdropConfirmDetails