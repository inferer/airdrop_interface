import { useCallback, useEffect, useState } from "react";
import { useAirdropManagerContract, useAirdropUserTaskContract, useMulticallContract } from "./useContract";
import { BigNumber, Contract } from "ethers";
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
import { CampaignManager_ABI, CampaignManager_NETWORKS } from "../constants/campaignManager";
import { updateCampaignList, updateCampaignListOne } from "../state/campaign/actions";

export const getCampaignManagerAddress = (chainId: ChainId) => {
  return CampaignManager_NETWORKS[chainId]
}

export const getAirdropUserTaskAddress = (chainId: ChainId) => {
  return AirdropUserTask_NETWORKS[chainId]
}

export const getAirdropLength = async (multi: Contract, chaidId: ChainId) => {

  const calls = []
    calls.push({
      address: getCampaignManagerAddress(chaidId),
      name: 'currentCampaignId',
      params: []
    })

  const [ currentAirdropId ] = await multicall(multi, CampaignManager_ABI, calls)

  return currentAirdropId ? currentAirdropId[0]?.toString() : 0
}

export const getLabelCampaignIds = async (multi: Contract, airToken: string, chaidId: ChainId) => {

  const calls = []
    calls.push({
      address: getCampaignManagerAddress(chaidId),
      name: 'getLabelCampaignIds',
      params: [airToken]
    })
    

  const [ ids ] = await multicall(multi, CampaignManager_ABI, calls)
  return (ids && ids[0] || []).map((id: any) => id && id.toString()).filter((id: any) => !!id)
}

export const getUserCampaignIds = async (multi: Contract, account: string, chaidId: ChainId) => {
  const calls = []
    calls.push({
      address: getCampaignManagerAddress(chaidId),
      name: 'getUserCampaignIds',
      params: [account]
    })


  const [ ids ] = await multicall(multi, CampaignManager_ABI, calls)
  return (ids && ids[0] || []).map((id: any) => id && id.toString()).filter((id: any) => !!id)
}

export const getCampaignList = async (multi: Contract, airdropLength: number | number[], chaidId: ChainId) => {
  const calls = []
  if (typeof airdropLength === 'number') {
    for(let i = 1; i <= airdropLength; i++) {
      calls.push({
        address: getCampaignManagerAddress(chaidId),
        name: 'getCampaign',
        params: [i]
      })
    }
  } else {
    for(let i = 0, len = airdropLength.length; i < len; i++) {

      calls.push({
        address: getCampaignManagerAddress(chaidId),
        name: 'getCampaign',
        params: [airdropLength[i]]
      })
    }
  }
  

  let campaignList: {[key: string]: string}[] = []

  try {
    const res = await multicall(multi, CampaignManager_ABI, calls.reverse());
    (res || []).forEach((data: any) => {
      const airdrop = data[0]
      const offerTokenData = getUSDTTokenByAddress(airdrop[2][0])
      const labelTokenData = getLabelTokenByAddress(airdrop[2][1])
      const subDecimals = String((10 ** (offerTokenData?.decimals ?? 18))).length - (airdrop[3][0].toString()).length
      // const subDecimals = 18
      const _offerLocked = (Number(airdrop[3][0].toString()) / (10 ** (offerTokenData?.decimals ?? 18))).toString()
      
      const _offerLabelLocked = (Number(airdrop[3][3].toString()) / (10 ** (labelTokenData?.decimals ?? 18))).toString()
      // const _applyExpireOnTime = new Date(Number(airdrop[3][1].toString()) * 1000) 
      // const _applyExpireOn = new Date(_applyExpireOnTime.getTime() + _applyExpireOnTime.getTimezoneOffset() * 60000).getTime()
      const _applyExpireOn = Number(airdrop[3][1].toString()) * 1000
      const _expireOn = Number(airdrop[3][2].toString()) * 1000
      const _labelLocked = (Number(airdrop[3][3]) / (10 ** (labelTokenData?.decimals ?? 18))).toString()
      const _awardList = airdrop[6].map((item: any[]) => {
        return {
          a:  Number(item[0].toString()) / (10 ** (offerTokenData?.decimals ?? 18)),
          s: Number(item[1].toString())
        }
      })

      const _otherContent = airdrop[1][5] ? airdrop[1][5].split('|') : []
      const tempData: any = {
        campaignId: airdrop[0].toString(),
        name: airdrop[1][0],
        label: airdrop[1][1],
        channel: airdrop[1][2],
        action: airdrop[1][3],
        content: airdrop[1][4],
        chain: _otherContent[0],
        landingPage: airdrop[1][4],
        arwId: airdrop[1][5],
        offerToken: {
          ...offerTokenData,
        },
        offerAirToken: airdrop[2][1],
        labelToken: {
          ...labelTokenData
        },
        sender: airdrop[2][3],
        offerLocked: _offerLocked,
        offerLabelLocked: _offerLabelLocked,
        labelLocked: _labelLocked,
        unit: BigNumber.from(airdrop[3][3]).toString(),
        duration: airdrop[4].toString(),
        startTimestamp: airdrop[5].toString(),
        applyExpireOn: transformTime(_applyExpireOn),
        expireOn: transformTime(_expireOn),
        realCompleted: airdrop[7],
        awardList: _awardList,
        isApplyExpired: _applyExpireOn < Date.now(),
        isExpired: _expireOn < Date.now()
      }
      campaignList.push(tempData)
    });
  } catch (err) {
    console.log(err)
  }
  return campaignList

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
      address: getCampaignManagerAddress(chaidId),
      name: 'getUserAirdropConfirmed',
      params: [account]
    })

  const userAirdropConfirmed = await multicall(multi, CampaignManager_ABI, calls)
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

export function useCampaignManager() {
  const dispatch = useDispatch<AppDispatch>()
  const { account, chainId } = useActiveWeb3React()
  const airdropList = useUserAirdropConfirmedList()
  const multi = useMulticallContract()
  const airdropManager = useAirdropManagerContract()
  const airdropUserTask = useAirdropUserTaskContract()

  const handleUpdateAirdropList = useCallback(async () => {
    dispatch(updateAirdropList({ airdropList: [] }))
  }, [dispatch])

  const handleGetCampaignList = useCallback(async (algToken?: string) => {
    if (multi && chainId) {
      if (algToken) {
        const airToken = getAirTokenFromAlgToken(algToken, chainId)
        let campaignIds = await getLabelCampaignIds(multi, airToken, chainId)
        const list = await getCampaignList(multi, campaignIds, chainId)
        dispatch(updateCampaignList({ campaignList: list as any }))
      } else {
        // let airdropLength = await getAirdropLength(multi, chainId) 
        // const list = await getCampaignList(multi, Number(airdropLength), chainId)
        // dispatch(updateAirdropList({ airdropList: list as any }))
      }
      
    }
  }, [multi, dispatch, chainId])

  const handleGetUserCampaignList = useCallback(async (account?: string) => {
    if (multi && chainId) {
      if (account) {
        let airdropIds = await getUserCampaignIds(multi, account, chainId)
        const list = await getCampaignList(multi, airdropIds, chainId)
        dispatch(updateCampaignList({ campaignList: list as any }))
      }
      
    }
  }, [multi, dispatch, chainId])

  const handleGetCampaignOne = useCallback(async (airdropId: number) => {
    if (multi && chainId) {
      const list = await getCampaignList(multi, [airdropId], chainId)
      dispatch(updateCampaignListOne({ campaignList: list as any }))
    }
  }, [multi, dispatch, chainId])

  const handleGetAirdropOne2 = useCallback(async (airdropId: number) => {
    if (multi && chainId) {
      const list = await getCampaignList(multi, [airdropId], chainId)
      return list[0]
    }
  }, [multi, dispatch, chainId])

  const handleGetUserAirdropConfirmed = useCallback(async (refresh?: boolean) => {
    if (multi && airdropUserTask && account && (refresh || airdropList.length <= 0) && chainId ) {
      let userAirdropConfirmed = await getUserAirdropConfirmed2(airdropUserTask, account) 
      const userConfirmedIds = userAirdropConfirmed.map((item: { airdropId: any; }) => item.airdropId).filter((airdropId: string) => parseInt(airdropId) > 0)
      const list = await getCampaignList(multi, userConfirmedIds, chainId)
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
    handleGetCampaignList,
    handleGetCampaignOne,
    handleGetUserAirdropConfirmed,
    handleGetUserTaskConfirmed,
    handleUpdateUserAirdropConfirmedByTaskId,
    handleGetUserCampaignList,
    handleGetAirdropOne2,
    handleUpdateAirdropList,
    handleGetAirdropUserConfirmed,
    airdropUserConfirmed
  }

}