

import { useAirdropTokenScoreContract, useMulticallContract,useAirdropUserPoolContract } from "./useContract";
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
import { useShowToast } from "../state/application/hooks";

const zeroPadByte32 = (numberAsString:string) =>{
  if(numberAsString.length === 66){
      return numberAsString;
  }
  if(numberAsString.indexOf("0x")>=0){
      numberAsString = numberAsString.slice(2);
  }
  return "0x" + ("0".repeat(64 - numberAsString.length)) + numberAsString;
}

export const getAirdropTokenScoreAddress = () => {
  return AirdropTokenScore_NETWORKS[NETWORK_CHAIN_ID as ChainId]
}

export const getAccountProof = async (account: string, label: string) => {

  // const res = await fetcher(`/api/airdrop/getTokenProof`, { account, label })
  const res = await userPoolSrvcFetcher(`/api/userpool/getTokenProof`, { account, label })
  if (res.code === 0 && res.data) {
    return res.data.hexProof
  }
  return null
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
      const _tokenAmount = BigNumber.from(userToken[3].toString()).div(BigNumber.from(String(10 ** 18))).toString()

      tempList.push({
        claimed: userToken[0].toString(),
        latestTimestamp: userToken[1].toString(),
        claimTokenTimestamp: _claimTokenTimestamp,
        tokenAmount: _tokenAmount,
        tokenTotalAmount: _tokenAmount,
        unclaimed: 0,
        token: getAlgLabelTokenByAddress(tokenList[index].address) 
      }) 
    }
  })
  return tempList
}

export const getLockedAlgAssets = async (multi: Contract, tokenAddress: string, score: number) => {
  const calls = [{
      address: getAirdropTokenScoreAddress(),
      name: 'getLockedAlgAssets',
      params: [tokenAddress, score]
    }]
  // const tempData = await multicall(multi, AirdropTokenScore_ABI, [{
  //   address: getAirdropTokenScoreAddress(),
  //   name: 'getBlockTimestamp',
  //   params: []
  // }])
  // console.log(tempData[0][0].toString())
  // const dataList = await multicall(multi, AirdropTokenScore_ABI, calls)
  // const data = dataList[0][0]
  // if (!data) return '0'
  // const amount = BigNumber.from(data.toString()).div(BigNumber.from(String(10 ** 18))).toString()
  // console.log(tokenAddress, amount)
  // return amount

  const supplyAmount = await multi.getLockedAlgAssets(tokenAddress, score)
  const amount = BigNumber.from(supplyAmount.toString()).div(BigNumber.from(String(10 ** 18))).toString()
  return amount
}

export function useAirdropTokenScore() {
  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()
  const multi = useMulticallContract()
  const airdropTokenScore = useAirdropUserPoolContract();// useAirdropTokenScoreContract()
  const allAlgToken = useAlgLabelAllTokens()

  const handleGetAlgTokenList = useCallback(async () => {
    if (account && multi) {
      const algTokens = Object.values(allAlgToken)
      if (algTokens.length > 0) {
        const algTokenList = await getUserTokenClaim(multi, algTokens, account)
        dispatch(updateUserAlgAirdropList({ algAirdropList: algTokenList }))

      }
    }
  }, [
    account,
    multi,
    allAlgToken
  ])

  const [claimStatus, setClaimStatus] = useState(0)
  const { handleShow } = useShowToast()
  const handleClaim = useCallback(async (label: string, tokenAddress: string, lockedAmount: string, score: number) => {
    if (account && airdropTokenScore) {
      let _label = label.slice(4)
      // if (_label === 'Sports') {
      //   _label = 'Sport'
      // }
      // if (_label === 'Commerce') {
      //   _label = 'Shopping'
      // }
      setClaimStatus(1)
      try {
        const proof = await getAccountProof(account, _label)
        // const {elementIndex,elementHash,siblingsHashes,peaksHashes,elementsCount} = proof;
        if (proof && proof.elementHash) {
          // const tx = await airdropTokenScore.claimToken(tokenAddress, score * 100, proof)
          const tx = await airdropTokenScore.claimToken(
            tokenAddress,
            proof.elementIndex, 
            zeroPadByte32(proof.elementHash), 
            proof.siblingsHashes.map((v: string)=>zeroPadByte32(v)), 
            proof.peaksHashes.map((v:string)=>zeroPadByte32(v)), 
            proof.elementsCount
          )
          const receipt = await tx.wait()
          if (receipt.status) {
            handleGetAlgTokenList()
            handleShow({ type: 'success', content: `Received ${lockedAmount} ${label} tokens successfully.` })
          } else {
            handleShow({ type: 'error', content: `Fail to received ${label} tokens.`, title: 'Error' })
          }
        } else {
          console.log(proof)
          handleShow({ type: 'error', content: `Fail to received ${label} tokens.`, title: 'Error' })
        }
        setClaimStatus(0)

      } catch (err: any) {
        console.log(err)
        handleShow({ type: 'error', content: `Fail to received ${label} tokens.`, title: 'Error' })
        setClaimStatus(0)
      }
      
    }
    
  }, [account, airdropTokenScore, handleGetAlgTokenList, handleShow])

  return {
    handleGetAlgTokenList,
    handleClaim,
    claimStatus
  }

}

export function useAccountLabelScore(account: string, label?: string) {
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

export function useAccountTokenSupply(tokenAddress: string, score: number, balance?: string) {
  const [supplyAmount, setSupplyAmount] = useState('0')

  const { account } = useActiveWeb3React()
  const multi = useMulticallContract()
  const airdropTokenScore = useAirdropTokenScoreContract()

  useEffect(() => {
    if (account && airdropTokenScore && tokenAddress && score) {
      getLockedAlgAssets(airdropTokenScore, tokenAddress, score * 100).then((amount) => {
        setSupplyAmount(amount)
      })
    }
  }, [account, airdropTokenScore, tokenAddress, score, balance])

  return supplyAmount
}

