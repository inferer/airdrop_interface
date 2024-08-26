import { useCallback, useEffect, useState } from "react";
import { useAirdropReferManagerContract, useMulticallContract } from "./useContract";
import { BigNumber, Contract } from "ethers";
import { ChainId } from "@uniswap/sdk";
import multicall from "../utils/multicall";
import { transformTime } from "../utils";
import router from 'next/router'
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state";

import { useActiveWeb3React } from ".";
import { AirdropReferManager_NETWORKS, AirdropReferManager_ABI } from "../constants/airdropReferManager";
import { referTo } from "../state/user/api";

export const getReferManagerAddress = (chainId: ChainId) => {
  return AirdropReferManager_NETWORKS[chainId]
}

export const getReferNodeList = async (multi: Contract, airdropId: string, chaidId: ChainId) => {
  const calls = []
    calls.push({
      address: getReferManagerAddress(chaidId),
      name: 'getReferNodeList',
      params: [airdropId]
    })

  const [ nodeList ] = await multicall(multi, AirdropReferManager_ABI, calls)
  const list = nodeList[0] || []
  const nodeListNew = list.map((node: any) => {
    return {
      id: node.id.toString(),
      pid: node.pid.toString(),
      index: node.index.toString(),
      addr: node.addr
    }
  })

  return nodeListNew
}

export function useAirdropReferManager() {
  const dispatch = useDispatch<AppDispatch>()
  const { account, chainId } = useActiveWeb3React()
  const multi = useMulticallContract()
  const referManager = useAirdropReferManagerContract()

  const handleGetReferNodeList = useCallback(async () => {
    const airdropId = router.query.airdropId as string
    if (multi && chainId && airdropId) {
      const list = await getReferNodeList(multi, airdropId, chainId)
      return list
    }
  }, [multi, dispatch, chainId, router.query])

  const handleReferTo = useCallback(async (airdropId: string, pAddress: string) => {

    const res = await referTo(airdropId, pAddress)
    console.log(res, 222222)
    return res
  }, [referManager])
  return {
    handleGetReferNodeList,
    handleReferTo
  }

}