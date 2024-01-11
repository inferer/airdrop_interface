import { AppDispatch } from "../state"
import { useDispatch } from "react-redux"
import { useActiveWeb3React } from "."
import { useAirdropAssetTreasuryContract, useMulticallContract } from "./useContract"
import { useCallback } from "react"
import { useAirLabelAllTokens, useAlgLabelAllTokens, useUSDTAllTokens } from "./Tokens"
import { AirdropAssetTreasury_NETWORKS, AirdropAssetTreasury_ABI } from "../constants/airdropAssetTreasury"
import { NETWORK_CHAIN_ID } from "../connectors"
import { BigNumber, Contract } from "ethers"
import multicall from "../utils/multicall"
import { ChainId, ETHER, JSBI, Token, TokenAmount } from "@uniswap/sdk"
import { updateProjectLabelLocked, updateProjectUSDTLocked, updateUserAlgTokenLocked } from "../state/airdrop/actions"
import { AddressZero_ETH } from "../constants"


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

export const getProjectUSDTLocked = async (multi: Contract, account: string, tokenList: Token[]) => {

  const calls: any[] = []
  tokenList.map(token => {
    calls.push({
      address: getAirdropAssetTreasuryAddress(),
      name: 'projectUSDTLocked',
      params: [account, token.address]
    })
  })
    

  const res = await multicall(multi, AirdropAssetTreasury_ABI, calls)
  return (res || []).map((item: any, index: number) => {
    const temp = new TokenAmount(tokenList[index], JSBI.BigInt(item.toString()))
    return {
      ...tokenList[index],
      lockedAmount: temp.toSignificant(6)
    }
  })
}

export const getUserAlgTokenLocked = async (multi: Contract, account: string, tokenList: Token[]) => {

  const calls: any[] = []
  tokenList.map(token => {
    calls.push({
      address: getAirdropAssetTreasuryAddress(),
      name: 'userAlgTokenLocked',
      params: [account, token.address]
    })
  })
    

  const res = await multicall(multi, AirdropAssetTreasury_ABI, calls)
  return (res || []).map((item: any, index: number) => {
    const temp = new TokenAmount(tokenList[index], JSBI.BigInt(item.toString()))
    return {
      ...tokenList[index],
      lockedAmount: temp.toSignificant(6)
    }
  })
}


export function useAirdropAssetTreasury() {
  const dispatch = useDispatch<AppDispatch>()
  const { account } = useActiveWeb3React()

  const multi = useMulticallContract()
  const airLabelAllTokens = useAirLabelAllTokens()
  const algLabelAllTokens = useAlgLabelAllTokens()
  const usdtAllTokens = useUSDTAllTokens()

  const airdropAssetTreasury = useAirdropAssetTreasuryContract()

  const handleGetProjectLabelLocked = useCallback(async (account: string) => {
    const airTokenList = Object.values(airLabelAllTokens)
    if (account && multi && airdropAssetTreasury && airTokenList.length > 0) {
      const list = await getProjectLabelLocked(multi, account, airTokenList)

      dispatch(updateProjectLabelLocked({ tokenLockedList: list }))
    }

  }, [multi, airdropAssetTreasury, airLabelAllTokens])

  const handleGetProjectUSDTLocked = useCallback(async (account: string) => {
    const usdtTokenList = Object.values(usdtAllTokens)
    if (account && multi && airdropAssetTreasury && usdtTokenList.length > 0) {
      const list = await getProjectUSDTLocked(multi, account, [AddressZero_ETH[ChainId.MAINNET] ,...usdtTokenList])
      dispatch(updateProjectUSDTLocked({ tokenLockedList: list }))
    }

  }, [multi, airdropAssetTreasury, usdtAllTokens])

  const handleGetUserAlgTokenLocked = useCallback(async (account: string) => {
    const algTokenList = Object.values(algLabelAllTokens)
    if (account && multi && airdropAssetTreasury && algTokenList.length > 0) {
      const list = await getUserAlgTokenLocked(multi, account, algTokenList)
      dispatch(updateUserAlgTokenLocked({ tokenLockedList: list }))
    }

  }, [multi, airdropAssetTreasury, usdtAllTokens])

  return {
    handleGetProjectLabelLocked,
    handleGetProjectUSDTLocked,
    handleGetUserAlgTokenLocked
  }

}