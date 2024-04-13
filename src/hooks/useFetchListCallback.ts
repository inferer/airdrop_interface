import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@uniswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../state'
import { fetchTokenList } from '../state/lists/actions'
import getTokenList, { getTokenListLocal } from '../utils/getTokenList'
import { useActiveWeb3React } from './index'


export function useFetchListCallback(): (listUrl: string) => Promise<TokenList> {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    async (listUrl: string) => {
      const requestId = nanoid()
      dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenListLocal(listUrl, chainId)
        .then(tokenList => {
          dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch(error => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
          throw error
        })
    },
    [dispatch, chainId]
  )
}
