import { Currency, CurrencyAmount, JSBI, Pair, Percent, TokenAmount } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { IAirdrop } from './actions'


export function useAirdropList() {
  return useSelector<AppState, AppState['airdrop']['airdropList']>(state => state.airdrop.airdropList)
}

export function useAirdropList0(airdropId: string | undefined) {
  const airdropListOne = useSelector<AppState, AppState['airdrop']['airdropListOne']>(state => state.airdrop.airdropListOne)
  return useMemo(() => {
    return  airdropListOne.find(airdrop => airdrop.airdropId === airdropId ) ?? {} as IAirdrop
  }, [airdropListOne, airdropId])
}

