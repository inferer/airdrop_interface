
import React, { useEffect, useMemo, useState } from "react";
import { useAirdropList0 } from "../../state/airdrop/hooks";
import router, { useRouter } from 'next/router'
import { useAirdropManager } from "../../hooks/useAirdropManager";
import AirdropInfo from "./AirdropInfo";
import { ButtonSwap } from "../../components/Button";

const AirdropConfirmDetails: React.FC<{

}> = () => {
  const router = useRouter()
  const { handleGetAirdropOne } = useAirdropManager()

  useEffect(() => {
    if (router.query.id) {
      handleGetAirdropOne(Number(router.query.id))
    }
  }, [router.query])


  const airdrop = useAirdropList0(router.query.id as string)


  return (
    <div className="py-5 pt-0">
      <AirdropInfo airdrop={airdrop} />
      <div className=" flex justify-center">
        <div className="w-[260px] mt-5">
          <ButtonSwap
            onClick={() => {
              router.back()
            }}
          >
            <div className="btn-text">
              Return
            </div>
          </ButtonSwap>
        </div>
      </div>
    </div>
  )
}

export default AirdropConfirmDetails