import { Currency, CurrencyAmount, JSBI, Pair, Percent, TokenAmount } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { IAirdrop, IAlgAirdrop, updateAirTokenPercent, updateMaxUnits } from './actions'


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

export function useUserLabelScore(account: string, label: string) {
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
