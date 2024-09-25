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
import { updateAirdropReferNodeList } from "../state/airdrop/actions";
import { useShowToast } from "../state/application/hooks";
import { useCurrency } from "./Tokens";
import { useCurrencyBalance } from "../state/wallet/hooks";
import { useApproveCallback } from "./useApproveCallback";

export const getReferManagerAddress = (chainId: ChainId) => {
  return AirdropReferManager_NETWORKS[chainId]
}

export const getReferNodeList = async (multi: Contract, airdropId: string, chaidId: ChainId) => {
  try {
    const calls = []
    calls.push({
      address: getReferManagerAddress(chaidId),
      name: 'getReferNodeList',
      params: [airdropId]
    })

    const [ nodeList ] = await multicall(multi, AirdropReferManager_ABI, calls)
    console.log(nodeList, getReferManagerAddress(chaidId), airdropId, 333333)
    const list = nodeList && nodeList[0] || []
    const nodeListNew = list.map((node: any) => {
      return {
        id: node.id.toString(),
        pid: node.pid.toString(),
        index: node.index.toString(),
        addr: node.addr
      }
    })
    return nodeListNew
  } catch(error) {
    console.log(error)
    return []
  }
  
}

export function useAirdropReferManager(algToken?: string) {
  const dispatch = useDispatch<AppDispatch>()
  const { account, chainId } = useActiveWeb3React()

  const algTokenCurrency = useCurrency(algToken)
  const algTokenCurrencyAmount = useCurrencyBalance(account ?? undefined, algTokenCurrency ?? undefined)
  const [approvalState, approve] = useApproveCallback(algTokenCurrencyAmount,  chainId && AirdropReferManager_NETWORKS[chainId])

  const multi = useMulticallContract()
  const referManager = useAirdropReferManagerContract()
  const { handleShow } = useShowToast()
  const [confirmStatus, setConfirmStatus] = useState(0)

  const handleGetReferNodeList = useCallback(async (_airdropId?) => {
    const airdropId = _airdropId || router.query.airdropId as string
    if (multi && chainId && airdropId) {
      const list = await getReferNodeList(multi, airdropId, chainId)
      dispatch(updateAirdropReferNodeList({referNodeList: list}))
      return list
    }
    
    return []
  }, [multi, dispatch, chainId, router.query])

  const handleReferTo = useCallback(async (airdropId: string, pAddress: string) => {

    const res = await referTo(airdropId, pAddress)
    
    return res
  }, [referManager])

  const handleReferTo2 = useCallback(async (airdropId: string, pAddress: string) => {
    if (referManager && account) {
      setConfirmStatus(1)
      let gasLimit = '5000000'
      try {
        const gasEstimate = await referManager.estimateGas['referTo'](airdropId, pAddress)
        gasLimit = gasEstimate.toString()
      } catch (error: any) {
        console.log(error)
        const message = error.data?.data?.message || error.data?.message || error.message
        console.log(message)
        handleShow({ type: 'error', content: `Fail to confirm.`, title: 'Error' })
        setConfirmStatus(2)
        return
      }
      try {
        const tx = await referManager.referTo(airdropId, pAddress, { gasPrice: '1000000000', gasLimit: gasLimit })
        const receipt = await tx.wait()
        if (receipt.status) {
          router.push('/user/ongoing')
        }
      } catch (error) {
        console.log(error)
        handleShow({ type: 'error', content: `Fail to confirm.`, title: 'Error' })
      }
      
      setConfirmStatus(2)
    }

  }, [referManager, account])
  
  return {
    handleGetReferNodeList,
    handleReferTo,
    handleReferTo2,
    confirmStatus,
    approvalState,
    approve,
    algTokenCurrency
  }

}