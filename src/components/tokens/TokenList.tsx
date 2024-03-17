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

const TokenItem = ({
  token,
  isProjectMode,
  isRewards,
  currentTokenAddress,
  onClick
}: {
  token: Currency,
  isProjectMode?: boolean
  isRewards?: boolean
  onClick?: (value: string, token: Currency) => void,
  currentTokenAddress?: string
}) => {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, token)
  // @ts-ignore
  const tokenLocked = useProjectLabelLocked(token.address)
  // @ts-ignore
  const usdtLocked = useProjectUSDTLocked(token.address)
  // @ts-ignore
  const depositBalance = useUserDepositBalance(token.address)

  return (
    <div className=" rounded-[6px] border border-[rgba(107,190,225,0.2)] px-5 py-4 flex flex-col justify-between min-h-[130px]">
      <div className="flex items-center">
        <CurrencyLogo currency={token} size="24" />
        <div className=" text-[16px] font-fmedium ml-[6px] first-up">{token.symbol}</div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Balance</div>
          <div className="text-[18px] font-fmedium">{balance?.toSignificant(6)}</div>
        </div>
        {
          isProjectMode && 
          <>
            <div className="flex justify-between items-center mt-2">
              <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Locked</div>
              <div className="text-[18px] font-fmedium">{ isRewards ? tokenLocked.lockedAmount : usdtLocked.lockedAmount }</div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Deposit</div>
              <Withdraw isDeposit isProjectMode={isProjectMode} token={token} onClick={onClick} currentTokenAddress={currentTokenAddress} balance={depositBalance?.lockedAmount ?? '0'} />
            </div>
          </>
        }
        
      </div>
    </div>
  )
}
const AlgTokenItem = ({
  token,
  currentTokenAddress,
  claim
}: {
  token: Currency,
  isProjectMode?: boolean
  currentTokenAddress?: string
  claim?: (label: string, tokenAddress: string, lockedAmount: string, score: number) => void
}) => {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, token)
  // @ts-ignore
  const algAirdrop = useAlgAirdrop(token.address)
  const accountScore = useAccountLabelScore(account || '', token?.symbol?.slice(4) || '' )
  // @ts-ignore
  const tokenLocked = useUserAlgTokenLocked(token.address)
  // @ts-ignore
  const supplyAmount = useAccountTokenSupply(token.address, accountScore, balance?.toSignificant(6))
  return (
    <div className=" rounded-[6px] border border-[rgba(107,190,225,0.2)] px-5 py-4 flex flex-col justify-between min-h-[130px]">
      <div className="flex items-center">
        <CurrencyLogo currency={token} size="24" />
        <div className=" text-[16px] font-fmedium ml-[6px] first-up">{token.symbol}</div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Balance</div>
          <div className="text-[18px] font-fmedium">{balance?.toSignificant(6)}</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Locked</div>
          <div className="text-[18px] font-fmedium">{tokenLocked.lockedAmount}</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Supply</div>
          <div className="text-[18px] font-fmedium">{supplyAmount}</div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Supply in plan</div>
          <div className="text-[18px] w-[40px] h-[24px] flex items-center justify-center font-fmedium bg-[rgba(161,206,168,0.06)] rounded px-[6px] text-[#A1CEA8] cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              if (currentTokenAddress) return
              claim && claim(algAirdrop.token.symbol || '', algAirdrop.token.address, supplyAmount, accountScore)
            }}
          > 
            {
              currentTokenAddress === algAirdrop?.token?.address ? <Loading size="16px" stroke="#A1CEA8" /> : 'Get'
            }
          </div>
        </div>
      </div>
    </div>
  )
}
const AirUSDTTokenItem = ({
  token,
  onClick,
  currentTokenAddress,
  isProjectMode
}: {
  token: Currency,
  onClick?: (value: string, token: Currency) => void,
  currentTokenAddress?: string
  isProjectMode?: boolean

}) => {
  const { account, chainId } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, token)

  return (
    <div className=" rounded-[6px] border border-[rgba(107,190,225,0.2)] px-5 py-4 flex flex-col justify-between min-h-[130px]">
      <div className="flex items-center">
        <CurrencyLogo currency={token} size="24" />
        <div className=" text-[16px] font-fmedium ml-[6px] first-up">{token.symbol}</div>
      </div>
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Balance</div>
          <div className="text-[18px] font-fmedium flex items-center">
            {balance?.toSignificant(6)}
            <LazyImage src="/images/airdrop/lock.svg" className="ml-[3px]" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-[rgba(0,0,0,0.4)] text-[12px] font-fmedium">Withdraw</div>
          <Withdraw isProjectMode={isProjectMode} token={token} onClick={onClick} currentTokenAddress={currentTokenAddress} balance={balance ? balance?.toSignificant(6) : '0'} />
        </div>
        
      </div>
    </div>
  )
}
const TokenList = () => {
  const router = useRouter()
  const isRewards = (router.query.action && router.query.action[0]) === "rewards"
  const isProjectMode = useIsRoleProjectMode()
  const airLabelAllTokens = useAirLabelAllTokens()
  const usdtAllTokens = useUSDTAllTokens()
  const { account } = useActiveWeb3React()
  const algLabelAllTokens = useAlgLabelAllTokens()
  const airUSDTAllTokens = useAllTokens()

  const { handleGetAlgTokenList, handleClaim, claimStatus } = useAirdropTokenScore()

  const { handleGetProjectLabelLocked, handleGetProjectUSDTLocked, handleGetUserAlgTokenLocked, handleGetDepositBalance, handleUserWithdraw, handleUserDeposit, withdrawStatus } = useAirdropAssetTreasury()

  const algTokenList = useMemo(() => {
    return Object.values(algLabelAllTokens)
  }, [algLabelAllTokens])

  const airTokenList = useMemo(() => {
    return Object.values(airLabelAllTokens)
  }, [airLabelAllTokens])
  const usdtTokenList = useMemo(() => {
    return Object.values(usdtAllTokens)
  }, [usdtAllTokens])

  const airUSDTTokenList = useMemo(() => {
    return Object.values(airUSDTAllTokens)
  }, [airUSDTAllTokens])

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
      handleGetDepositBalance(account)
    }
    if (account && !isProjectMode && !isRewards) {
      handleGetUserAlgTokenLocked(account)
    }
  }, [account, isProjectMode, isRewards, handleGetProjectLabelLocked, handleGetProjectUSDTLocked, handleGetUserAlgTokenLocked])

  const [currentTokenAddress, setCurrentTokenAddress] = useState('')
  const _handleClaim = useCallback(async (label: string, tokenAddress: string, lockedAmount: string, score: number) => {
    setCurrentTokenAddress(tokenAddress)
    handleClaim(label, tokenAddress, lockedAmount, score)
  }, [])

  useEffect(() => {
    console.log(claimStatus, withdrawStatus)
    if (claimStatus !== 1 && withdrawStatus !== 1) {
      setCurrentTokenAddress('')
    }
  }, [claimStatus, withdrawStatus])

  const _handleWithdraw = useCallback(async (value: string, token: Currency) => {
    console.log(value, token)
    // @ts-ignore
    setCurrentTokenAddress(token.address)
    // @ts-ignore
    handleUserWithdraw(value, token)
  }, [])

  const _handleUserDeposit = useCallback(async (value: string, token: Currency) => {
    console.log(value, token)
    // @ts-ignore
    setCurrentTokenAddress(token.address)
    // @ts-ignore
    handleUserDeposit(value, token)
  }, [])
  
  return (
    <div className=" mt-[55px]">
      <div className="text-[18px] font-fmedium text-black mb-5">{isProjectMode && !isRewards ? 'Funds' : 'Tokens'}</div>
      <div className=" grid grid-cols-2 gap-x-[30px] gap-y-[20px]">
        {
          filterList.map(token => {
            return (isRewards || isProjectMode) 
            ? <TokenItem 
                key={token.symbol} 
                token={token} 
                isProjectMode={isProjectMode} 
                isRewards={isRewards} 
                currentTokenAddress={currentTokenAddress} 
                onClick={_handleUserDeposit}
              />
            : <AlgTokenItem key={token.symbol} token={token} isProjectMode={isProjectMode} claim={_handleClaim} currentTokenAddress={currentTokenAddress} />
          })
        }
        
      </div>
      {
        !isProjectMode && isRewards &&
        <>
          <div className="text-[18px] font-fmedium text-black mb-5 mt-[50px]">Funds</div>
          <div className=" grid grid-cols-2 gap-x-[30px] gap-y-[20px]">
            {
              airUSDTTokenList.map(token => {
                return <AirUSDTTokenItem key={token.symbol} token={token} onClick={_handleWithdraw} currentTokenAddress={currentTokenAddress} />
              })
            }
          </div>
        </>
      }
      {
        isProjectMode && !isRewards &&
        <>
          <div className="text-[18px] font-fmedium text-black mb-5 mt-[50px]">Air Funds</div>
          <div className=" grid grid-cols-2 gap-x-[30px] gap-y-[20px]">
            {
              airUSDTTokenList.map(token => {
                return <AirUSDTTokenItem key={token.symbol} token={token} onClick={_handleWithdraw} currentTokenAddress={currentTokenAddress} isProjectMode={isProjectMode} />
              })
            }
          </div>
        </>
      }
    </div>
  )
}

export default TokenList