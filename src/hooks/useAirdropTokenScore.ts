

import { useAirdropTokenScoreContract, useMulticallContract } from "./useContract";
import multicall from "../utils/multicall";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useActiveWeb3React } from ".";
import { useAlgLabelAllTokens } from "./Tokens";
import { BigNumber, Contract } from "ethers";
import { AirdropTokenScore_ABI, AirdropTokenScore_NETWORKS } from "../constants/airdropTokenScore";
import { NETWORK_CHAIN_ID } from "../connectors";
import { ChainId, Token } from "@uniswap/sdk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state";
import { updateUserAlgAirdropList, updateUserLabelScore } from "../state/airdrop/actions";
import { getAlgLabelTokenByAddress, getAlgTokenByLabel } from "../utils/getTokenList";
import { fetcher,userPoolSrvcFetcher } from "../utils/axios";
import { useUserLabelScore } from "../state/airdrop/hooks";

export const getAirdropTokenScoreAddress = () => {
  return AirdropTokenScore_NETWORKS[NETWORK_CHAIN_ID as ChainId]
}

export const getAccountProof = async (account: string, label: string) => {

  const res = await userPoolSrvcFetcher(`/api/admerkle/getTokenProof`, { account, label })
  if (res.code === 0 && res.data) {
    return res.data.hexProof || []
  }
  return []
}


export const getAccountScore = async (account: string, label: string) => {
  const res = await fetcher(`/api/airdrop/getAccountScore`, { account, label })
  if (res.code === 0 && res.data) {
    return res.data
  }
  return { score: '0' }
}

export const getUserTokenClaim = async (multi: Contract, tokenList: Token[], account: string) => {
  const calls = tokenList.map(token => {
    return {
      address: getAirdropTokenScoreAddress(),
      name: 'getUserTokenClaim',
      params: [account, token.address]
    }
  })

  const dataList = await multicall(multi, AirdropTokenScore_ABI, calls)
  const tempList: any[] = [];
  (dataList || []).map((item: any, index: number) => {
    if (item) {
      const userToken = item[0] || []
      const _claimTokenTimestamp = userToken[2].toString()
      const _tokenTimestamp = userToken[3].toString()
      const _tokenAmount = BigNumber.from(userToken[4].toString()).div(BigNumber.from(String(10 ** 18))).toString()
      tempList.push({
        claimed: userToken[0].toString(),
        latestTimestamp: userToken[1].toString(),
        claimTokenTimestamp: _claimTokenTimestamp,
        tokenTimestamp: _tokenTimestamp,
        tokenAmount: _tokenAmount,
        tokenTotalAmount: userToken[5].toString(),
        unclaimed: _claimTokenTimestamp === _tokenTimestamp ? '0' : _tokenAmount,
        token: getAlgLabelTokenByAddress(tokenList[index].address) 
      }) 
    }
  })
  return tempList
}

export function useAirdropTokenScore() {
  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()
  const multi = useMulticallContract()
  const airdropTokenScore = useAirdropTokenScoreContract()
  const allAlgToken = useAlgLabelAllTokens()

  const handleGetAlgTokenList = useCallback(async () => {
    if (account && multi) {
      const algTokens = Object.values(allAlgToken)
      if (algTokens.length > 0) {
        const algTokenList = await getUserTokenClaim(multi, algTokens, account)
        console.log(algTokenList)
        dispatch(updateUserAlgAirdropList({ algAirdropList: algTokenList }))

      }
    }
  }, [
    account,
    multi,
    allAlgToken
  ])

  const [claimStatus, setClaimStatus] = useState(0)
  const handleClaim = useCallback(async (label: string, tokenAddress: string) => {
    if (account && airdropTokenScore) {
      let _label = label.slice(4)
      if (_label === 'Sports') {
        _label = 'Sport'
      }
      if (_label === 'Commerce') {
        _label = 'Shopping'
      }
      setClaimStatus(1)
      try {
        const proof = await getAccountProof(account, _label)
        if (proof.length > 0) {
          const tx = await airdropTokenScore.claimToken(tokenAddress, proof)
          const receipt = await tx.wait()
          if (receipt.status) {
            handleGetAlgTokenList()
            alert('Success')
          } else {
            alert('Error')
          }
        } else {
          alert('Error')
        }
        setClaimStatus(0)

      } catch (err) {
        console.log(err)
        setClaimStatus(0)
      }
      
    }
    
  }, [account, airdropTokenScore, handleGetAlgTokenList])

  return {
    handleGetAlgTokenList,
    handleClaim,
    claimStatus
  }

}

export function useAccountLabelScore(account: string, label: string) {
  const dispatch = useDispatch<AppDispatch>()
  const [score, setScore] = useState(0)

  const userScore = useUserLabelScore(account, label)
  useEffect(() => {
    if (account && label) {
      if (userScore >= 0) {
        setScore(userScore)
      } else
      if (getAlgTokenByLabel(label) && userScore < 0) {
        getAccountScore(account, label)
        .then(res => {
          const score = Number(res.score) < 0 ? 0 : Number(res.score)
          setScore(score)
          dispatch(updateUserLabelScore({key: `${account?.toLocaleLowerCase()}_${label?.toLocaleLowerCase()}`, score: score}))
          
        })
      }
      
    }
  }, [account, label, getAlgTokenByLabel, userScore])

  return score
}

