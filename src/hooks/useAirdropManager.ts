import { useCallback, useEffect, useState } from "react";
import { useAirdropManagerContract, useMulticallContract } from "./useContract";
import { BigNumber, Contract } from "ethers";
import { AirdropManager_ABI, AirdropManager_NETWORKS } from "../constants/airdropManager";
import { NETWORK_CHAIN_ID } from "../connectors";
import { ChainId } from "@uniswap/sdk";
import multicall from "../utils/multicall";
import { getAirTokenFromAlgToken, getLabelTokenByAddress, getUSDTTokenByAddress } from "../utils/getTokenList";
import { transformTime } from "../utils";
import router from 'next/router'
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state";
import { updateAirdropList, updateAirdropListOne, updateUserAirdropConfirmed } from "../state/airdrop/actions";
import { useActiveWeb3React } from ".";
import { useMaxUnits } from "../state/airdrop/hooks";

export const getAirdropManagerAddress = () => {
  return AirdropManager_NETWORKS[NETWORK_CHAIN_ID as ChainId]
}

export const getAirdropLength = async (multi: Contract) => {

  const calls = []
    calls.push({
      address: getAirdropManagerAddress(),
      name: 'currentAirdropId',
      params: []
    })

  const [ currentAirdropId ] = await multicall(multi, AirdropManager_ABI, calls)

  return currentAirdropId ? currentAirdropId[0]?.toString() : 0
}

export const getLabelAirdropIds = async (multi: Contract, airToken: string) => {

  const calls = []
    calls.push({
      address: getAirdropManagerAddress(),
      name: 'getLabelAirdropIds',
      params: [airToken]
    })

  const [ ids ] = await multicall(multi, AirdropManager_ABI, calls)
  return (ids && ids[0] || []).map((id: any) => id && id.toString()).filter((id: any) => !!id)
}

export const getAirdropList = async (multi: Contract, airdropLength: number | number[]) => {
  const calls = []
  if (typeof airdropLength === 'number') {
    for(let i = 1; i <= airdropLength; i++) {
      calls.push({
        address: getAirdropManagerAddress(),
        name: 'getAirdrop',
        params: [i]
      })
    }
  } else {
    for(let i = 0, len = airdropLength.length; i < len; i++) {

      calls.push({
        address: getAirdropManagerAddress(),
        name: 'getAirdrop',
        params: [airdropLength[i]]
      })
    }
  }
  

  let airdropList: {[key: string]: string}[] = []
  // string[] calldata _baseInfo, // 0: name, 1: label, 2: channel, 3: action, 4: content
	// 	address[] calldata _offer_label_token, // 0: offerToken, 1: offerAirToken 2: labelToken 3: sender
	// 	uint[] calldata _offer_label_locked, // 0: offerLocked, 1: labelLocked
	// 	uint64 _duration
  try {
    const res = await multicall(multi, AirdropManager_ABI, calls.reverse());
    (res || []).forEach((data: any) => {
      const airdrop = data[0]
      const offerTokenData = getUSDTTokenByAddress(airdrop[2][0])
      const labelTokenData = getLabelTokenByAddress(airdrop[2][2])
      
      const tempData: any = {
        airdropId: airdrop[0].toString(),
        name: airdrop[1][0],
        label: airdrop[1][1],
        channel: airdrop[1][2],
        action: airdrop[1][3],
        content: airdrop[1][4],
        offerToken: {
          ...offerTokenData,
        },
        offerAirToken: airdrop[2][1],
        labelToken: {
          ...labelTokenData
        },
        sender: airdrop[2][3],
        offerLocked: BigNumber.from(airdrop[3][0]).div(BigNumber.from((10 ** (offerTokenData?.decimals ?? 1)).toString())).toString(),
        labelLocked: BigNumber.from(airdrop[3][2]).div(BigNumber.from((10 ** (labelTokenData?.decimals ?? 1)).toString())).toString(),
        unit: BigNumber.from(airdrop[3][3]).toString(),
        duration: airdrop[4].toString(),
        startTimestamp: airdrop[5].toString(),
        expireOn: transformTime(Number(airdrop[5].toString()) * 1000 + Number(airdrop[4].toString()) * 1000),
        claimed: airdrop[6].toString()

      }
      airdropList.push(tempData)
    });
  } catch (err) {
    console.log(err)
  }
  return airdropList

}

export const getUserAirdropConfirmed = async (multi: Contract, account: string) => {
  const calls = []
    calls.push({
      address: getAirdropManagerAddress(),
      name: 'getUserAirdropConfirmed',
      params: [account]
    })

  const userAirdropConfirmed = await multicall(multi, AirdropManager_ABI, calls)
  return userAirdropConfirmed[0] && userAirdropConfirmed[0][0] && userAirdropConfirmed[0][0][0] ? userAirdropConfirmed.map((item: any[]) => {
    const tempItem = item[0][0]
    if (tempItem) {
      return {
        completed: tempItem.completed,
        airdropId: tempItem[2]?.toString(),
        userAddress: tempItem[3],
        amount: tempItem[4]?.toString(),
        confirmedTimestamp: tempItem[8]?.toString()
      }
    }
  }) : []
}

export const getUserAirdropConfirmed2 = async (airdropManager: Contract, account: string) => {
  const userAirdropConfirmed = await airdropManager.getUserAirdropConfirmed(account)

  return userAirdropConfirmed && userAirdropConfirmed[0] ? userAirdropConfirmed.map((item: any) => {
    const tempItem = item
    return {
      completed: tempItem.completed,
      airdropId: tempItem[2]?.toString(),
      userAddress: tempItem[3],
      confirmedTimestamp: tempItem[8]?.toString()
    }
  }) : []
}

export const getUserTaskConfirmed = async (airdropManager: Contract, airdropId: string, account: string) => {
  const userTaskConfirmed = await airdropManager.getUserTaskConfirmed(airdropId, account)
  const tempItem = userTaskConfirmed
  return {
    completed: tempItem.completed,
    airdropId: tempItem[2]?.toString(),
    userAddress: tempItem[3],
    amount: tempItem[4]?.toString(),
    confirmedTimestamp: tempItem[8]?.toString()
  }
}

export function useAirdropManager() {
  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()

  const multi = useMulticallContract()
  const airdropManager = useAirdropManagerContract()

  const handleGetAirdropList = useCallback(async (algToken?: string) => {
    if (multi) {
      if (algToken) {
        const airToken = getAirTokenFromAlgToken(algToken)
        let airdropIds = await getLabelAirdropIds(multi, airToken)

        const list = await getAirdropList(multi, airdropIds)
        dispatch(updateAirdropList({ airdropList: list as any }))
      } else {
        let airdropLength = await getAirdropLength(multi) 
        const list = await getAirdropList(multi, Number(airdropLength))
        dispatch(updateAirdropList({ airdropList: list as any }))
      }
      
    }
  }, [multi])

  const handleGetAirdropOne = useCallback(async (airdropId: number) => {
    if (multi) {
      const list = await getAirdropList(multi, [airdropId])
      dispatch(updateAirdropListOne({ airdropList: list as any }))
    }
  }, [multi])

  const handleGetUserAirdropConfirmed = useCallback(async () => {
    if (multi && airdropManager && account) {
      let userAirdropConfirmed = await getUserAirdropConfirmed2(airdropManager, account) 
      const userConfirmedIds = userAirdropConfirmed.map((item: { airdropId: any; }) => item.airdropId).filter((airdropId: string) => parseInt(airdropId) > 0)
      const list = await getAirdropList(multi, userConfirmedIds)
      const tempConfirmed = userAirdropConfirmed.reverse()
      const newList = list.map((item, index) => ({ ...item, ...tempConfirmed[index]}))
      dispatch(updateUserAirdropConfirmed({ airdropList: newList as any }))
    }
  }, [multi, airdropManager, account])

  const handleGetUserTaskConfirmed = useCallback(async (airdropId: string) => {
    if (airdropManager && account) {
      let userTaskConfirmed = await getUserTaskConfirmed(airdropManager, airdropId, account) 
      return userTaskConfirmed
    }
  }, [airdropManager, account])

  useEffect(() => {
    const fetch = async () => {
      if (multi) {
        let airdropLength: number | number[] = 0
        if (router.query.id && router.query.id[0]) {
          airdropLength = [Number(router.query.id[0])]
        } else {
          airdropLength = await getAirdropLength(multi) 
        }
        const list = await getAirdropList(multi, Number(airdropLength))
        dispatch(updateAirdropList({ airdropList: list as any }))
      }
    }

    // fetch()

  }, [multi, router.query])

  return {
    handleGetAirdropList,
    handleGetAirdropOne,
    handleGetUserAirdropConfirmed,
    handleGetUserTaskConfirmed
  }

}