import { AppDispatch } from "../state"
import { useDispatch } from "react-redux"
import { useActiveWeb3React } from "."
import { useAirdropAssetTreasuryContract, useMulticallContract } from "./useContract"
import { useCallback } from "react"
import { useAirLabelAllTokens } from "./Tokens"
import { AirdropAssetTreasury_NETWORKS, AirdropAssetTreasury_ABI } from "../constants/airdropAssetTreasury"
import { NETWORK_CHAIN_ID } from "../connectors"
import { BigNumber, Contract } from "ethers"
import multicall from "../utils/multicall"
import { Token } from "@uniswap/sdk"
import { updateProjectLabelLocked } from "../state/airdrop/actions"


export const getAirdropAssetTreasuryAddress = () => {
  // @ts-ignore
  return AirdropAssetTreasury_NETWORKS[NETWORK_CHAIN_ID as ChainId]
}

export const getProjectLabelLocked = async (multi: Contract, account: string, tokenList: Token[]) => {

  const calls: any[] = []
  tokenList.map(token => {
    calls.push({
      address: getAirdropAssetTreasuryAddress(),
      name: 'projectLabelLocked',
      params: [account, token.address]
    })
  })
    

  const res = await multicall(multi, AirdropAssetTreasury_ABI, calls)
  return (res || []).map((item: any, index: number) => {
    return {
      ...tokenList[index],
      lockedAmount: BigNumber.from(item.toString()).div(BigNumber.from((10 ** tokenList[index].decimals).toString(10))).toString()
    }
  })
}


export function useAirdropAssetTreasury() {
  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()

  const multi = useMulticallContract()
  const airLabelAllTokens = useAirLabelAllTokens()

  const airdropAssetTreasury = useAirdropAssetTreasuryContract()

  const handleGetProjectLabelLocked = useCallback(async (account: string) => {
    const airTokenList = Object.values(airLabelAllTokens)
    if (account && multi && airdropAssetTreasury && airTokenList.length > 0) {
      const list = await getProjectLabelLocked(multi, account, airTokenList)

      dispatch(updateProjectLabelLocked({ tokenLockedList: list }))
    }

  }, [multi, airdropAssetTreasury, airLabelAllTokens])

  return {
    handleGetProjectLabelLocked
  }

}