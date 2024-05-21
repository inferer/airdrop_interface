
import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../Collect/Table";
import LazyImage from "../../components/LazyImage";
import { useAirdropList, useMaxUnits } from "../../state/airdrop/hooks";
import { useRouter } from "next/router";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { getALgTokenFromAirToken, getAlgCampaignToken, getAlgLabelTokenByAddress } from "../../utils/getTokenList";
import { useActiveWeb3React } from "../../hooks";
import { useAccountLabelScore } from "../../hooks/useAirdropTokenScore";
import { useCollectSwapInfo } from "../../state/swap/hooks";
import { Tooltip2 } from "../../components/Tooltip";
import { formatStringNumber, openBrowser, shortenAddress } from "../../utils";
import CurrencyLogo from "../../components/CurrencyLogo";
import useCopyClipboard from "../../hooks/useCopyClipboard";
import { FundToken } from "../Project/Ongoing";
import { useCampaignManager } from "../../hooks/useCampaignManager";
import { useCampaignList } from "../../state/campaign/hooks";
import { CampaignList } from "../CampaignList/Ongoing";

const CampaignListAlg: React.FC<{

}> = () => {
  const { account, chainId } = useActiveWeb3React()
  const router = useRouter()

  const { handleGetCampaignList } = useCampaignManager()
  const airdropList = useAirdropList()
  const campaignList = useCampaignList()
  const maxUnits = useMaxUnits()
  const {
    currencyBalances,
    parsedAmount,
    parsedAmountOUTPUT,
    parsedAmountOUTPUTDerived,
    currencies,
    inputError: collectInputError
  } = useCollectSwapInfo()
  
  const filterAirdropList = useMemo(() => {
    const algAmount = Number(router.query.airAmount ?? 1)
    let filterAirdropList = []
    if (algAmount <= 3) {
      filterAirdropList = airdropList.filter(airdrop => Number(airdrop.unit) <= algAmount)
    } else {
      filterAirdropList = airdropList
    }
    const tempAirdropList = filterAirdropList.filter(airdrop => Number(airdrop.unit) <= maxUnits && !airdrop.completed && (Number(airdrop.labelLocked) - Number(airdrop.claimed) >= Number(airdrop.unit)))
    let tempList = []
    let tempTotal = 0
    if (maxUnits > 0 && algAmount > 0 && tempAirdropList.length > 0) {
      for (let k = 0; k < tempAirdropList.length; k++) {
        if (tempList.length === 0) {
          tempList.push({...tempAirdropList[k]})
          tempTotal += Number(tempAirdropList[k].unit)
        } else {
          if (tempTotal < algAmount) {
            tempList.push({...tempAirdropList[k]})
            tempTotal += Number(tempAirdropList[k].unit)
            if (tempTotal > algAmount) {
              tempList.pop()
              break
            }
          } else {
            break
          }
        }
        
      }
    }
    // return airdropList.filter(airdrop => Number(airdrop.unit) <= maxUnits && !airdrop.completed && (Number(airdrop.labelLocked) - Number(airdrop.claimed) >= accountScore))
    return tempList
  }, [maxUnits, airdropList, parsedAmountOUTPUT])

  useEffect(() => {
    let _algToken
    if (router.query.action) {
      _algToken = getAlgCampaignToken(chainId)

      _algToken && handleGetCampaignList(_algToken.address)
    }
  }, [router, chainId])

  return (
    <div>
      <CampaignList list={campaignList} />
    </div>
  )
}

export default CampaignListAlg