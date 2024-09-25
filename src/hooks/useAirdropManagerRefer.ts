import { useCallback, useEffect, useState } from "react";
import { useAirdropManagerContract, useAirdropUserTaskContract, useMulticallContract } from "./useContract";
import { BigNumber, Contract } from "ethers";
import { AirdropManager_ABI, AirdropManager_NETWORKS } from "../constants/airdropManager";
import { AirdropUserTask_ABI, AirdropUserTask_NETWORKS } from "../constants/airdropUserTask";
import { ChainId } from "@uniswap/sdk";
import multicall from "../utils/multicall";
import { getAirTokenFromAlgToken, getLabelTokenByAddress, getUSDTTokenByAddress } from "../utils/getTokenList";
import { transformTime } from "../utils";
import router from 'next/router'
import { useDispatch } from "react-redux";
import { AppDispatch } from "../state";
import { updateAirdropList, updateAirdropListOne, updateProjectAirdropList, updateUserAirdropConfirmed, updateUserAirdropConfirmedByTaskId } from "../state/airdrop/actions";
import { useActiveWeb3React } from ".";
import { useMaxUnits, useUserAirdropConfirmedList } from "../state/airdrop/hooks";

export const getAirdropManagerAddress = (chainId: ChainId) => {
  return AirdropManager_NETWORKS[chainId]
}

export const getAirdropUserTaskAddress = (chainId: ChainId) => {
  return AirdropUserTask_NETWORKS[chainId]
}

export const getAirdropLength = async (multi: Contract, chaidId: ChainId) => {

  const calls = []
    calls.push({
      address: getAirdropManagerAddress(chaidId),
      name: 'currentAirdropId',
      params: []
    })

  const [ currentAirdropId ] = await multicall(multi, AirdropManager_ABI, calls)

  return currentAirdropId ? currentAirdropId[0]?.toString() : 0
}

export const getLabelAirdropIds = async (multi: Contract, airToken: string, chaidId: ChainId) => {

  const calls = []
    calls.push({
      address: getAirdropManagerAddress(chaidId),
      name: 'getLabelAirdropIds',
      params: [airToken]
    })
    

  const [ ids ] = await multicall(multi, AirdropManager_ABI, calls)
  return (ids && ids[0] || []).map((id: any) => id && id.toString()).filter((id: any) => !!id)
}

export const getUserAirdropIds = async (multi: Contract, account: string, chaidId: ChainId) => {
  const calls = []
    calls.push({
      address: getAirdropManagerAddress(chaidId),
      name: 'getUserAirdropIds',
      params: [account]
    })


  const [ ids ] = await multicall(multi, AirdropManager_ABI, calls)
  return (ids && ids[0] || []).map((id: any) => id && id.toString()).filter((id: any) => !!id)
}

export const getAirdropList = async (multi: Contract, airdropLength: number | number[], chaidId: ChainId) => {

  
  const calls = []
  if (typeof airdropLength === 'number') {
    for(let i = 1; i <= airdropLength; i++) {
      calls.push({
        address: getAirdropManagerAddress(chaidId),
        name: 'getAirdrop',
        params: [i]
      })
    }
  } else {
    for(let i = 0, len = airdropLength.length; i < len; i++) {

      calls.push({
        address: getAirdropManagerAddress(chaidId),
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
      // const subDecimals = String((10 ** (offerTokenData?.decimals ?? 18))).length - (airdrop[3][0].toString()).length
      const subDecimals = 18
      const _offerLocked = (Number(airdrop[3][0].toString()) / (10 ** (offerTokenData?.decimals ?? 18))).toString()
      const _offerLabelLocked = (Number(airdrop[3][1].toString()) / (10 ** (labelTokenData?.decimals ?? 18))).toString()
      const expireOnTimestamp = Number(airdrop[5].toString()) * 1000 + Number(airdrop[4].toString()) * 1000
      const _labelLocked = (Number(airdrop[3][2]) / (10 ** (labelTokenData?.decimals ?? 18))).toFixed(4)
      const _claimed = (Number(airdrop[6].toString()) / (10 ** (labelTokenData?.decimals ?? 18))).toString()
      const _completedClaimed = (Number(airdrop[8].toString()) / (10 ** (labelTokenData?.decimals ?? 18))).toString()

      const _otherContent = airdrop[1][5] ? airdrop[1][5].split('|') : []
      const parameterType = _otherContent[1] ? JSON.parse(_otherContent[1] ?? '""') : []
      const parameterValue = airdrop[1][6] ? airdrop[1][6].split('|') : []
      const parameterInfo = parameterType.map((item: any, index: number) => ({...item, value: parameterValue[index] }))

      const isAirdropRefer = airdrop[1][6] === 'ERC721'

      const tempData: any = {
        airdropId: airdrop[0].toString(),
        name: airdrop[1][0],
        label: airdrop[1][1],
        channel: airdrop[1][2],
        action: airdrop[1][3],
        content: isAirdropRefer ? airdrop[1][3] : airdrop[1][4],
        chain: _otherContent[0],
        nftAddress: airdrop[1][3],
        nftId: airdrop[1][4],
        landingPage: isAirdropRefer ? _otherContent[0] : _otherContent[2],
        parameterInfo: parameterInfo,
        offerToken: {
          ...offerTokenData,
        },
        offerAirToken: airdrop[2][1],
        labelToken: {
          ...labelTokenData
        },
        sender: airdrop[2][3],
        // offerLocked: BigNumber.from(airdrop[3][0]).div(BigNumber.from((10 ** (offerTokenData?.decimals ?? 18)).toString())).toString(),
        offerLocked: _offerLocked,
        offerLabelLocked: _offerLabelLocked,
        labelLocked: _labelLocked,
        unit: BigNumber.from(airdrop[3][3]).toString(),
        duration: airdrop[4].toString(),
        startTimestamp: airdrop[5].toString(),
        expireOn: transformTime(expireOnTimestamp),
        claimed: _claimed,
        completed: expireOnTimestamp < Date.now() || airdrop[7],
        realCompleted: airdrop[7],
        isExpired: expireOnTimestamp < Date.now(),
        completedClaimed: _completedClaimed,
        isAirdropRefer 

      }
      airdropList.push(tempData)
    });
  } catch (err) {
    console.log(err)
  }
  return airdropList

}

export const getAirdropUserConfirmed = async (multi: Contract, airdropId: number, chaidId: ChainId) => {
  const calls = []
    calls.push({
      address: getAirdropUserTaskAddress(chaidId),
      name: 'getAirdropTaskList',
      params: [airdropId]
    })

  const userAirdropConfirmed = await multicall(multi, AirdropUserTask_ABI, calls)
  return (userAirdropConfirmed[0] && userAirdropConfirmed[0][0] && userAirdropConfirmed[0][0]) ? userAirdropConfirmed[0][0].map((item: any) => {
    const tempItem = item
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

export const getUserAirdropConfirmed = async (multi: Contract, account: string, chaidId: ChainId) => {
  const calls = []
    calls.push({
      address: getAirdropManagerAddress(chaidId),
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
    const labelTokenData = getLabelTokenByAddress(tempItem[7])
    
    return {
      airAmount: Number(tempItem[5].toString()) / (10 ** (labelTokenData?.decimals ?? 18)),
      userCompleted: tempItem.completed,
      airdropId: tempItem[2]?.toString(),
      userAddress: tempItem[3],
      confirmedTimestamp: tempItem[8]?.toString(),
      id: tempItem[11]?.toString()
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
  const { account, chainId } = useActiveWeb3React()
  const airdropList = useUserAirdropConfirmedList()
  const multi = useMulticallContract()
  const airdropManager = useAirdropManagerContract()
  const airdropUserTask = useAirdropUserTaskContract()

  const handleUpdateAirdropList = useCallback(async () => {
    dispatch(updateAirdropList({ airdropList: [] }))
  }, [dispatch])

  const handleGetAirdropList = useCallback(async (algToken?: string) => {
    if (multi && chainId) {
      if (algToken) {
        const airToken = getAirTokenFromAlgToken(algToken, chainId)
        let airdropIds = await getLabelAirdropIds(multi, airToken, chainId)

        const list = await getAirdropList(multi, airdropIds, chainId)
        dispatch(updateAirdropList({ airdropList: list as any }))
      } else {
        let airdropLength = await getAirdropLength(multi, chainId) 
        const list = await getAirdropList(multi, Number(airdropLength), chainId)
        dispatch(updateAirdropList({ airdropList: list as any }))
      }
      
    }
  }, [multi, dispatch, chainId])

  const handleGetUserAirdropList = useCallback(async (account?: string) => {
    if (multi && chainId) {
      if (account) {
        let airdropIds = await getUserAirdropIds(multi, account, chainId)
        const list = await getAirdropList(multi, airdropIds, chainId)
        dispatch(updateProjectAirdropList({ airdropList: list as any }))
      }
      
    }
  }, [multi, dispatch, chainId])

  const handleGetAirdropOne = useCallback(async (airdropId: number) => {
    if (multi && chainId) {
      const list = await getAirdropList(multi, [airdropId], chainId)
      dispatch(updateAirdropListOne({ airdropList: list as any }))
    }
  }, [multi, dispatch, chainId])

  const handleGetAirdropOne2 = useCallback(async (airdropId: number) => {
    if (multi && chainId) {
      const list = await getAirdropList(multi, [airdropId], chainId)
      return list[0]
    }
  }, [multi, dispatch, chainId])

  const handleGetUserAirdropConfirmed = useCallback(async (refresh?: boolean) => {
    if (multi && airdropUserTask && account && (refresh || airdropList.length <= 0) && chainId ) {
      let userAirdropConfirmed = await getUserAirdropConfirmed2(airdropUserTask, account) 
      const userConfirmedIds = userAirdropConfirmed.map((item: { airdropId: any; }) => item.airdropId).filter((airdropId: string) => parseInt(airdropId) > 0)
      const list = await getAirdropList(multi, userConfirmedIds, chainId)
      const tempConfirmed = userAirdropConfirmed.reverse()
      const newList = list.map((item, index) => ({ ...item, ...tempConfirmed[index]}))
      dispatch(updateUserAirdropConfirmed({ airdropList: newList as any }))
    }
  }, [multi, airdropUserTask, airdropUserTask, account, airdropList, dispatch, chainId])

  const [airdropUserConfirmed, setAirdropUserComfirmed] = useState<any[]>([])
  const handleGetAirdropUserConfirmed = useCallback(async (airdropId: number) => {
    if (multi && airdropManager && account && chainId) {
      let list = await getAirdropUserConfirmed(multi, airdropId, chainId) 
      setAirdropUserComfirmed(list)
    }
  }, [multi, airdropManager, account, dispatch, chainId])

  const handleGetUserTaskConfirmed = useCallback(async (airdropId: string) => {
    if (airdropManager && account) {
      let userTaskConfirmed = await getUserTaskConfirmed(airdropManager, airdropId, account) 
      return userTaskConfirmed
    }
  }, [airdropManager, account])

  const handleUpdateUserAirdropConfirmedByTaskId = useCallback(async (taskIds: string[]) => {
    dispatch(updateUserAirdropConfirmedByTaskId({ taskIds }))
  }, [dispatch])


  return {
    handleGetAirdropList,
    handleGetAirdropOne,
    handleGetUserAirdropConfirmed,
    handleGetUserTaskConfirmed,
    handleUpdateUserAirdropConfirmedByTaskId,
    handleGetUserAirdropList,
    handleGetAirdropOne2,
    handleUpdateAirdropList,
    handleGetAirdropUserConfirmed,
    airdropUserConfirmed
  }

}