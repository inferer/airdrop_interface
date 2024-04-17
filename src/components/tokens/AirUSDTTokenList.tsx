import { Currency, ETHER, Token } from "@uniswap/sdk";
import { useAirLabelAllTokens, useAlgLabelAllTokens, useAllTokens, useCurrency, useUSDTAllTokens } from "../../hooks/Tokens";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CurrencyLogo from "../CurrencyLogo";
import { useActiveWeb3React } from "../../hooks";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { useIsRoleProjectMode } from "../../state/user/hooks";
import { useAccountLabelScore, useAccountTokenSupply, useAirdropTokenScore } from "../../hooks/useAirdropTokenScore";
import { useAlgAirdrop, useProjectLabelLocked, useProjectUSDTLocked, useUserAlgTokenLocked, useUserDepositBalance } from "../../state/airdrop/hooks";
import { useAirdropAssetTreasury } from "../../hooks/useAirdropAssetTreasury";
import { Loading } from "../Loader";
import LazyImage from "../LazyImage";
import Withdraw from "./Withdraw";
import { formatStringNumber } from "../../utils";


const AirUSDTTokenItem = ({
  token,
  onClick,
  currentTokenAddress,
  isProjectMode
}: {
  token: any,
  onClick?: (value: string, token: Currency) => void,
  currentTokenAddress?: string
  isProjectMode?: boolean

}) => {
  
  return (
    <div className=" rounded-[6px] border border-[rgba(107,190,225,0.2)] px-5 py-4 flex flex-col justify-between min-h-[130px]">
      <div className="flex items-center">
        <CurrencyLogo currency={token} size="24" />
        <div className=" text-[16px] font-fmedium ml-[6px] first-up">{token.symbol}</div>
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-center mt-2">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">TotalSupply</div>
          <div className="text-[18px] font-fmedium flex items-center">
            {formatStringNumber(token.totalSupply) }
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Balance</div>
          <div className="text-[18px] font-fmedium flex items-center">
            {formatStringNumber(token.balanceOf) }
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">InfererBalance</div>
          <div className="text-[18px] font-fmedium flex items-center">
            {formatStringNumber(token.infererBalance) }
            {/* <LazyImage src="/images/airdrop/lock.svg" className="ml-[3px]" /> */}
          </div>
        </div>
        
        
      </div>
    </div>
  )
}
const AirUSDTTokenList = () => {
  const router = useRouter()
  const isRewards = (router.query.action && router.query.action[0]) === "rewards"
  const isProjectMode = useIsRoleProjectMode()
  const { account } = useActiveWeb3React()
  const airUSDTAllTokens = useAllTokens()

  const { handleGetAirUSDTInfo } = useAirdropAssetTreasury()

  const airUSDTTokenList = useMemo(() => {
    return Object.values(airUSDTAllTokens)
  }, [airUSDTAllTokens])

  const [tokenList, setTokenList] = useState<any[]>([])
  
  useEffect(() => {
    if (account && isProjectMode && !isRewards) {
      handleGetAirUSDTInfo(account)
        .then(res => {
          setTokenList(res)
        })
    }

  }, [account, isProjectMode, isRewards, handleGetAirUSDTInfo])

  return (
    <div className="">

      {
        isProjectMode && !isRewards &&
        <>
          <div className="text-[18px] font-fmedium text-black mb-5">Air Funds</div>
          <div className=" grid grid-cols-2 gap-x-[30px] gap-y-[20px]">
            {
              tokenList.map(token => {
                return <AirUSDTTokenItem key={token.symbol} token={token} isProjectMode={isProjectMode} />
              })
            }
          </div>
        </>
      }
    </div>
  )
}

export default AirUSDTTokenList