import { Currency, CurrencyAmount, JSBI, Pair, Percent, TokenAmount } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { IAirdrop, IAlgAirdrop, TokenLocked, updateAirTokenPercent, updateMaxUnits } from './actions'
import { ethers } from 'ethers'


export function useProjectAirdropList() {
  return useSelector<AppState, AppState['airdrop']['projectAirdropList']>(state => state.airdrop.projectAirdropList)
}

export function useAirdropList() {
  return useSelector<AppState, AppState['airdrop']['airdropList']>(state => state.airdrop.airdropList)
}

export function useAirdropList0(airdropId: string | undefined) {
  const airdropListOne = useSelector<AppState, AppState['airdrop']['airdropListOne']>(state => state.airdrop.airdropListOne)
  return useMemo(() => {
    return  airdropListOne.find(airdrop => airdrop.airdropId === airdropId ) ?? {} as IAirdrop
  }, [airdropListOne, airdropId])
}

export function useUserAirdropConfirmedList() {
  return useSelector<AppState, AppState['airdrop']['userAirdropConfirmedList']>(state => state.airdrop.userAirdropConfirmedList)
}

export function useUserAlgAirdropList() {
  return useSelector<AppState, AppState['airdrop']['userAlgAirdropList']>(state => state.airdrop.userAlgAirdropList)
}

export function useAlgAirdrop(address: string) {
  const userAlgAirdropList = useUserAlgAirdropList()
  return useMemo(() => {
    return userAlgAirdropList.find(algDrop => algDrop.token?.address?.toLowerCase() === address.toLowerCase()) || ({} as IAlgAirdrop)
  }, [userAlgAirdropList, address])
}

export function useUserLabelScore(account: string, label?: string) {
  const userLabelScore = useSelector<AppState, AppState['airdrop']['userLabelScore']>(state => state.airdrop.userLabelScore)

  return useMemo(() => {
    if (!account || !label) return -1
    const score = userLabelScore[`${account?.toLocaleLowerCase()}_${label?.toLocaleLowerCase()}`]
    return score === undefined ? -1 : Number(score)
  }, [account, label])

}

export function useMaxUnits() {
  return useSelector<AppState, AppState['airdrop']['maxUnits']>(state => state.airdrop.maxUnits)
}

export function useUpdateMaxUnits() {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback((units: number) => {
    dispatch(updateMaxUnits({ units }))
  }, [dispatch])
}

export function useAirTokenPercent() {
  return useSelector<AppState, AppState['airdrop']['airTokenPercent']>(state => state.airdrop.airTokenPercent)
}

export function useUpdateAirTokenPercent() {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback((percent: number) => {
    dispatch(updateAirTokenPercent({ percent }))
  }, [dispatch])
}

export function useAirTokenPercentBalance(otherCurrencyBalance: CurrencyAmount | undefined) {

  const airPercent = useAirTokenPercent()

  const percentBalance = useMemo(() => {
    let balance1 = 0
    let balance2 = 0
    if (airPercent && otherCurrencyBalance) {
      const currencyBalance = otherCurrencyBalance.toSignificant(6)
      balance2 = Number((Number(currencyBalance) * airPercent / 100).toFixed(4))
      balance1 = Number((Number(currencyBalance) - balance2).toFixed(4))
    }

    return {
      balance1,
      balance2
    }
    
  }, [airPercent, otherCurrencyBalance])

  return percentBalance
}


export function useProjectTokenLockedList() {
  return useSelector<AppState, AppState['airdrop']['projectTokenLockedList']>(state => state.airdrop.projectTokenLockedList)
}

export function useProjectLabelLocked(address: string) {
  const projectTokenLockedList = useProjectTokenLockedList()
  return useMemo(() => {
    if (!address) return ({} as TokenLocked)
    return projectTokenLockedList.find(token => token?.address?.toLowerCase() === address.toLowerCase()) || ({} as TokenLocked)
  }, [projectTokenLockedList, address])
}

export function useProjectUSDTLockedList() {
  return useSelector<AppState, AppState['airdrop']['projectUSDTLockedList']>(state => state.airdrop.projectUSDTLockedList)
}

export function useProjectUSDTLocked(address: string = ethers.constants.AddressZero) {
  const projectUSDTLockedList = useProjectUSDTLockedList()
  return useMemo(() => {
    if (!address) return ({} as TokenLocked)
    return projectUSDTLockedList.find(token => token?.address?.toLowerCase() === address.toLowerCase()) || ({} as TokenLocked)
  }, [projectUSDTLockedList, address])
}
export function useUserAlgTokenLockedList() {
  return useSelector<AppState, AppState['airdrop']['userAlgTokenLocked']>(state => state.airdrop.userAlgTokenLocked)
}

export function useUserAlgTokenLocked(address: string = ethers.constants.AddressZero) {
  const userAlgTokenLockedList = useUserAlgTokenLockedList()
  return useMemo(() => {
    if (!address) return ({} as TokenLocked)
    return userAlgTokenLockedList.find(token => token?.address?.toLowerCase() === address.toLowerCase()) || ({} as TokenLocked)
  }, [userAlgTokenLockedList, address])
}

export function useUserDepositBalanceList() {
  return useSelector<AppState, AppState['airdrop']['userDepositBalanceList']>(state => state.airdrop.userDepositBalanceList)
}
export function useUserDepositBalance(address: string = ethers.constants.AddressZero) {
  const userDepositBalanceList = useUserDepositBalanceList()
  return useMemo(() => {
    if (!address) return ({} as TokenLocked)
    return userDepositBalanceList.find(token => token?.address?.toLowerCase() === address.toLowerCase()) || ({} as TokenLocked)
  }, [userDepositBalanceList, address])
}

export function useCreateContractABI() {
  const createContractABI = useSelector<AppState, AppState['airdrop']['createContractABI']>(state => state.airdrop.createContractABI)
  return useMemo(() => {
    return createContractABI
      .filter(item => item.type.toLowerCase() !== 'event' && item.type.toLowerCase() !== 'constructor')
      .map(item => {
        const inputs = item.inputs.filter(item => item.name !== '_taskId').map(subItem => ({...subItem, value: '', status: 0}))
        return { ...item, inputs, value: item.name, label: item.name, icon: '/images/airdrop/fun.svg'}
      })
  }, [createContractABI])
}