import { useCallback, useEffect, useState } from "react";
import { useMulticallContract } from "./useContract";
import { BigNumber, Contract } from "ethers";
import { AirdropManager_ABI, AirdropManager_NETWORKS } from "../constants/airdropManager";
import { NETWORK_CHAIN_ID } from "../connectors";
import { ChainId } from "@uniswap/sdk";
import multicall from "../utils/multicall";
import { getLabelTokenByAddress, getUSDTTokenByAddress } from "../utils/getTokenList";
import { transformTime } from "../utils";
import router from 'next/router'
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state";
import { updateAirdropList, updateAirdropListOne } from "../state/airdrop/actions";

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
  return currentAirdropId[0]?.toString()
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
        labelLocked: BigNumber.from(airdrop[3][1]).div(BigNumber.from((10 ** (labelTokenData?.decimals ?? 1)).toString())).toString(),
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

export function useAirdropManager() {
  const dispatch = useDispatch<AppDispatch>()

  const multi = useMulticallContract()

  const handleGetAirdropList = useCallback(async () => {
    if (multi) {
      let airdropLength = await getAirdropLength(multi) 
      const list = await getAirdropList(multi, Number(airdropLength))
      dispatch(updateAirdropList({ airdropList: list as any }))
    }
  }, [multi])

  const handleGetAirdropOne = useCallback(async (airdropId: number) => {
    if (multi) {
      const list = await getAirdropList(multi, [airdropId])
      dispatch(updateAirdropListOne({ airdropList: list as any }))
    }
  }, [multi])

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
    handleGetAirdropOne
  }

}