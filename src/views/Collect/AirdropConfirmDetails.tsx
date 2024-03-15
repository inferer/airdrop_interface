
import React, { useEffect, useMemo, useState } from "react";
import { useAirdropList0 } from "../../state/airdrop/hooks";
import router, { useRouter } from 'next/router'
import { useAirdropManager } from "../../hooks/useAirdropManager";
import AirdropInfo from "./AirdropInfo";
import { ButtonSwap, ButtonSwapUser } from "../../components/Button";
import { useIsRoleProjectMode } from "../../state/user/hooks";

const AirdropConfirmDetails: React.FC<{

}> = () => {
  const isProjectMode = useIsRoleProjectMode()
  const router = useRouter()
  const { handleGetAirdropOne, handleGetAirdropUserConfirmed, airdropUserConfirmed } = useAirdropManager()

  useEffect(() => {
    if (router.query.id) {
      handleGetAirdropOne(Number(router.query.id))
      handleGetAirdropUserConfirmed(Number(router.query.id))
    }
  }, [router.query])

  const airdrop = useAirdropList0(router.query.id as string)
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