import { Currency, ETHER, Token } from "@uniswap/sdk";
import { useAirLabelAllTokens, useAlgLabelAllTokens, useAllTokens, useCurrency, useUSDTAllTokens } from "../../hooks/Tokens";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import CurrencyLogo from "../CurrencyLogo";
import { useActiveWeb3React } from "../../hooks";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { useIsRoleProjectMode } from "../../state/user/hooks";
import { useAccountLabelScore, useAirdropTokenScore } from "../../hooks/useAirdropTokenScore";
import { useAlgAirdrop, useProjectLabelLocked, useProjectUSDTLocked, useUserAlgTokenLocked } from "../../state/airdrop/hooks";
import { useAirdropAssetTreasury } from "../../hooks/useAirdropAssetTreasury";

const TokenItem = ({
  token,
  isProjectMode,
  isRewards
}: {
  token: Currency,
  isProjectMode?: boolean
  isRewards?: boolean
}) => {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, token)
  // @ts-ignore
  const tokenLocked = useProjectLabelLocked(token.address)
  // @ts-ignore
  const usdtLocked = useProjectUSDTLocked(token.address)
  return (
    <div className=" rounded-[6px] border border-[rgba(107,190,225,0.2)] p-5 flex flex-col justify-between min-h-[130px]">
      <div className="flex items-center">
        <CurrencyLogo currency={token} size="24" />
        <div className=" text-[16px] font-fmedium ml-[6px] first-up">{token.symbol}</div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-medium">Balance</div>
          <div className="text-[16px] font-medium">{balance?.toSignificant(6)}</div>
        </div>
        {
          isProjectMode && 
          <div className="flex justify-between items-center mt-2">
            <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-medium">Locked</div>
            <div className="text-[16px] font-medium">{ isRewards ? tokenLocked.lockedAmount : usdtLocked.lockedAmount }</div>
          </div>
        }
        
      </div>
    </div>
  )
}
const AlgTokenItem = ({
  token,
  isProjectMode,
  claim
}: {
  token: Currency,
  isProjectMode?: boolean
  claim?: (label: string, tokenAddress: string) => void
}) => {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, token)
  // @ts-ignore
  const algAirdrop = useAlgAirdrop(token.address)
  const accountScore = useAccountLabelScore(account || '', token?.symbol?.slice(4) || '' )
  // @ts-ignore
  const tokenLocked = useUserAlgTokenLocked(token.address)
  // console.log(tokenLocked)
  return (
    <div className=" rounded-[6px] border border-[rgba(107,190,225,0.2)] p-5 flex flex-col justify-between min-h-[130px]">
      <div className="flex items-center">
        <CurrencyLogo currency={token} size="24" />
        <div className=" text-[16px] font-fmedium ml-[6px] first-up">{token.symbol}</div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-medium">Balance</div>
          <div className="text-[16px] font-medium">{balance?.toSignificant(6)}</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-medium">Locked</div>
          <div className="text-[16px] font-medium">{tokenLocked.lockedAmount}</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-medium">Supply</div>
          <div className="text-[16px] font-medium">{algAirdrop.unclaimed}</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-medium">Supply in plan</div>
          <div className="text-[16px] font-medium bg-[rgba(161,206,168,0.06)] rounded px-[6px] text-[#A1CEA8] cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              claim && claim(algAirdrop.token.symbol || '', algAirdrop.token.address)
            }}
          >Get</div>
        </div>
      </div>
    </div>
  )
}

const TokenList = () => {
  const router = useRouter()
  const isRewards = router.pathname === "/rewards"
  const isProjectMode = useIsRoleProjectMode()
  const airLabelAllTokens = useAirLabelAllTokens()
  const usdtAllTokens = useUSDTAllTokens()
  const { account } = useActiveWeb3React()
  const algLabelAllTokens = useAlgLabelAllTokens()
  const { handleGetAlgTokenList, handleClaim } = useAirdropTokenScore()

  const { handleGetProjectLabelLocked, handleGetProjectUSDTLocked, handleGetUserAlgTokenLocked } = useAirdropAssetTreasury()

  const algTokenList = useMemo(() => {
    return Object.values(algLabelAllTokens)
  }, [algLabelAllTokens])

  const airTokenList = useMemo(() => {
    return Object.values(airLabelAllTokens)
  }, [airLabelAllTokens])
  const usdtTokenList = useMemo(() => {
    return Object.values(usdtAllTokens)
  }, [usdtAllTokens])

  const filterList = useMemo(() => {
    if (isProjectMode) {
      if (isRewards) return airTokenList

      return [ETHER, ...usdtTokenList]
    }
    if (isRewards) return airTokenList
    return algTokenList
    
  }, [isRewards, airTokenList, usdtTokenList, algTokenList, isProjectMode])

  
  useEffect(() => {
    if (account && !isProjectMode && !isRewards) {
      handleGetAlgTokenList()
    }
    if (account && isProjectMode && isRewards) {
      handleGetProjectLabelLocked(account)
    }
    if (account && isProjectMode && !isRewards) {
      handleGetProjectUSDTLocked(account)
    }
    if (account && !isProjectMode && !isRewards) {
      handleGetUserAlgTokenLocked(account)
    }
  }, [account, isProjectMode, isRewards, handleGetProjectLabelLocked, handleGetProjectUSDTLocked, handleGetUserAlgTokenLocked])
  
  return (
    <div className=" mt-[55px]">
      <div className="text-[16px] font-fmedium text-black mb-5">Tokens</div>
      <div className=" grid grid-cols-2 gap-x-[30px] gap-y-[20px]">
        {
          filterList.map(token => {
            return (isRewards || isProjectMode) ? <TokenItem key={token.symbol} token={token} isProjectMode={isProjectMode} isRewards={isRewards} />
                                  : <AlgTokenItem key={token.symbol} token={token} isProjectMode={isProjectMode} claim={handleClaim} />
          })
        }
        {/* <TokenItem />
        <TokenItem />
        <TokenItem /> */}
      </div>
    </div>
  )
}

export default TokenList