
import React, { useEffect, useMemo, useState } from "react";
import router, { useRouter } from 'next/router'
import CampaignInfo from "./CampaignInfo";
import { ButtonSwap, ButtonSwapUser } from "../../components/Button";
import { useIsRoleProjectMode } from "../../state/user/hooks";
import { useCampaignManager } from "../../hooks/useCampaignManager";
import { useCampaignList0 } from "../../state/campaign/hooks";

const CampaignConfirmDetails: React.FC<{

}> = () => {
  const isProjectMode = useIsRoleProjectMode()
  const router = useRouter()
  const { handleGetCampaignOne } = useCampaignManager()

  useEffect(() => {
    if (router.query.action) {
      const id = router.query.action[1]
      handleGetCampaignOne(Number(id))
    }
  }, [router.query])

  const campaign = useCampaignList0(router.query?.action ? router.query?.action[1] as string : undefined)
  
  
  return (
    <div className="py-5 pt-0">
      <CampaignInfo campaign={campaign} from={isProjectMode ? 'project' : 'user'} />
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

export default CampaignConfirmDetails