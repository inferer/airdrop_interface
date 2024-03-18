import { ChainId, Pair, Token } from '@uniswap/sdk'
import flatMap from 'lodash.flatmap'
import { useCallback, useMemo, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS, UserAction, UserRoleMode } from '../../constants'

import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { AppDispatch, AppState } from '../index'
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  updateUserDarkMode,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  updateUserRoleMode,
  updateUserAction,
  updateRightMenu,
  updateLoginUserInfo
} from './actions'
import { airdropV2, airdropV2Swap, getUserInfo, getUserInviteCode, getUserNonce, verify2join } from './api'
import { useUserModeInputCurrency } from '../swap/hooks'
import { useRouter } from 'next/router'
import { useShowToast } from '../application/hooks'

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name
  }
}

function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  )
}

export function useIsShowRightMenu() {
  return useSelector<AppState, AppState['user']['showRightMenu']>(state => state.user.showRightMenu)
}

export function useShowRightMenu() {
  const dispatch = useDispatch<AppDispatch>()

  const showRightMenu = useIsShowRightMenu()

  const toggleShowRightMenu = useCallback((flag?: boolean) => {
    dispatch(updateRightMenu({ show: flag !== undefined ? flag : !showRightMenu}))
  }, [ dispatch, showRightMenu, updateRightMenu ])

  return { showRightMenu, toggleShowRightMenu }
}

export function useUserAction() {
  const dispatch = useDispatch<AppDispatch>()

  const userAction = useSelector<AppState, AppState['user']['userAction']>(state => state.user.userAction)

  const setUserAction = useCallback((action: UserAction) => {
    dispatch(updateUserAction({ userAction: action }))
  }, [ dispatch, updateUserAction ])

  return { userAction, setUserAction } 
}

export function useGetUserAction() {
  const router = useRouter()
  const action = router.query.action ? router.query.action[0] : 'create'
  return useMemo(() => {
    if (router.pathname === '/project/[...action]') {
      if (action === 'swap') {
        return UserAction.PROJECT_SWAP
      }
      if (action === 'create') {
        return UserAction.CREATE
      }
    } else {
      if (action === 'swap') {
        return UserAction.USER_SWAP
      }
      if (action === 'collect') {
        return UserAction.USER_COLLECT
      }
    }
    return UserAction.PROJECT_SWAP
  }, [router])
}

export function useIsUserAction() {
  // const userAction = useSelector<AppState, AppState['user']['userAction']>(state => state.user.userAction)
  const userAction = useGetUserAction()

  const isProjectSwap = useMemo(() => {
    return userAction === UserAction.PROJECT_SWAP
  }, [userAction])

  const isProjectCreate = useMemo(() => {
    return userAction === UserAction.CREATE
  }, [userAction])

  const isUserSwap = useMemo(() => {
    return userAction === UserAction.USER_SWAP
  }, [userAction])

  const isUserCollect = useMemo(() => {
    return userAction === UserAction.USER_COLLECT
  }, [userAction])

  return {
    isProjectSwap,
    isProjectCreate,
    isUserSwap,
    isUserCollect
  }
}


export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useSelector<
    AppState,
    { userDarkMode: boolean | null; matchesDarkMode: boolean }
  >(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode
    }),
    shallowEqual
  )

  return userDarkMode === null ? matchesDarkMode : userDarkMode
}

export function useIsRoleProjectMode(): boolean {
  // const roleMode = useSelector<AppState, AppState['user']['userRoleMode']>(state => state.user.userRoleMode)
  // return useMemo(() => roleMode === UserRoleMode.PROJECT , [roleMode])
  const router = useRouter()

  return useMemo(() => {
    if (
      router.pathname.indexOf('/project/') > -1 ||
      router.pathname === '/create'
    
    ) {
      return true
    } else {
      const isProjectMode = localStorage.getItem('airdrop_model')
      if (isProjectMode !== 'false') {
        return true
      }
      return false
    }
    return false
  }, [router])
}

export function useUserRoleMode(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const { handleReplaceSwapState } = useUserModeInputCurrency()

  const isProjectMode = useIsRoleProjectMode()

  const toggleSetUserRoleMode = useCallback(() => {
    dispatch(updateUserRoleMode({ userRoleMode: isProjectMode ? UserRoleMode.USER : UserRoleMode.PROJECT }))
    dispatch(updateUserAction({ userAction: !isProjectMode ? UserAction.PROJECT_SWAP : UserAction.USER_SWAP }))
    handleReplaceSwapState(!isProjectMode)
  }, [isProjectMode, dispatch, handleReplaceSwapState])

  return [isProjectMode, toggleSetUserRoleMode]
}


export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const darkMode = useIsDarkMode()

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }))
  }, [darkMode, dispatch])

  return [darkMode, toggleSetDarkMode]
}

export function useIsExpertMode(): boolean {
  return useSelector<AppState, AppState['user']['userExpertMode']>(state => state.user.userExpertMode)
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useDispatch<AppDispatch>()
  const expertMode = useIsExpertMode()

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }))
  }, [expertMode, dispatch])

  return [expertMode, toggleSetExpertMode]
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userSlippageTolerance = useSelector<AppState, AppState['user']['userSlippageTolerance']>(state => {
    return state.user.userSlippageTolerance
  })

  const setUserSlippageTolerance = useCallback(
    (userSlippageTolerance: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance }))
    },
    [dispatch]
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export function useUserDeadline(): [number, (slippage: number) => void] {
  const dispatch = useDispatch<AppDispatch>()
  const userDeadline = useSelector<AppState, AppState['user']['userDeadline']>(state => {
    return state.user.userDeadline
  })

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }))
    },
    [dispatch]
  )

  return [userDeadline, setUserDeadline]
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch]
  )
}

export function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React()
  const serializedTokensMap = useSelector<AppState, AppState['user']['tokens']>(({ user: { tokens } }) => tokens)
  return useMemo(() => {
    if (!chainId) return []
    return Object.values(serializedTokensMap[chainId as ChainId] ?? {}).map(deserializeToken)
  }, [serializedTokensMap, chainId])
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1)
  }
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch]
  )
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  return new Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, 'UNI-V2', 'Uniswap V2')
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), tokenAddress => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop though all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map(base => {
                  if (base.address === token.address) {
                    return null
                  } else {
                    return [base, token]
                  }
                })
                .filter((p): p is [Token, Token] => p !== null)
            )
          })
        : [],
    [tokens, chainId]
  )

  // pairs saved by users
  const savedSerializedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map(pairId => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(() => userPairs.concat(generatedPairs).concat(pinnedPairs), [
    generatedPairs,
    pinnedPairs,
    userPairs
  ])

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map(key => keyed[key])
  }, [combinedList])
}

export function useAirdrop() {
  const { account } = useActiveWeb3React() 
  
  const handleAirdrop = useCallback(async (algToken, totalAmount) => {
        // return
    if (account) {
      
      const res = await getUserNonce(account)
      
      if (res.code === 0) {
        const msg = `0x${Buffer.from(res.data.nonce, 'utf8').toString('hex')}`;
        // @ts-ignore
        const sign = await window.ethereum.request({
          method: 'personal_sign',
          params: [msg, account, 'Inferer'],
        });
        // const totalAmount = '1000000000000000000000'
        
        const airdropRes = await airdropV2(account, sign, totalAmount + '000000000000000000', algToken);
        console.log(airdropRes)

      }
    }
    
  }, [
    account,
    getUserNonce,

  ])
  const handleAirdropSwap = useCallback(async (algTokenAddress, airTokenAddress) => {
    if (account) {
      const res = await getUserNonce(account)
      
      if (res.code === 0) {
        const msg = `0x${Buffer.from(res.data.nonce, 'utf8').toString('hex')}`;
        // @ts-ignore
        const sign = await window.ethereum.request({
          method: 'personal_sign',
          params: [msg, account, 'Inferer'],
        });
        const amount = '9000000000000000000000'
        const swpRes = await airdropV2Swap(account, sign, [account], [amount], algTokenAddress, airTokenAddress);
        console.log(swpRes)

      }
    }
    
  }, [
    account,
    getUserNonce,

  ])

  return {
    handleAirdrop,
    handleAirdropSwap
  }
}

export function useLoginUserInfo() {
  return useSelector<AppState, AppState['user']['loginUserInfo']>(state => state.user.loginUserInfo) 
}

export function useUserInfo() {
  const router = useRouter()
  const { handleShow } = useShowToast()
  const dispatch = useDispatch<AppDispatch>()
  const { account, activate, deactivate } = useActiveWeb3React()

  const [joinStatus, setJoinStatus] = useState(0)
  const [codeStatus, setCodeStatus] = useState(0)

  const handleGetUserInfo = useCallback(async (account: string) => {
    dispatch(updateLoginUserInfo({ userInfo: {id: 0, address: '', pAddress: '', inviteCode: '', createdAt: ''} }))
    const res = await getUserInfo(account)
    dispatch(updateLoginUserInfo({ userInfo: res }))
    return res
  }, [])

  const handleGetUserInviteCode = useCallback(async (account: string) => {
    const res = await getUserInviteCode(account)
    return res
  }, [])

  const handleUserJoin = useCallback(async (account: string, code: string) => {
    setJoinStatus(1)
    const res = await verify2join(account, code)
    if (res && res.address) {
      setJoinStatus(0)
      setCodeStatus(0)
      dispatch(updateLoginUserInfo({ userInfo: res }))
      router.push('/project/swap')
    } else {
      handleShow({ type: 'error', content: `Invalid invitation code.`, title: 'Fail' })
      deactivate()
    }
    setJoinStatus(0)
    setCodeStatus(0)
  }, [account, deactivate, dispatch, setCodeStatus, setJoinStatus])

  const handleVerifyInviteCode = useCallback(async (code: string) => {
    setCodeStatus(1)
    const res = await verify2join('', code)
    if (res && res.address) {
      setCodeStatus(2)
      return 1
    } else {
      setCodeStatus(0)
      handleShow({ type: 'error', content: `Invalid invitation code.`, title: 'Fail' })
      return -1
    }
  }, [setCodeStatus])

  const handleSetCodeStatus = useCallback(async () => {
    setCodeStatus(-1)
  }, [setCodeStatus])

  return {
    handleGetUserInfo,
    handleGetUserInviteCode,
    handleUserJoin,
    handleVerifyInviteCode,
    handleSetCodeStatus,
    joinStatus,
    codeStatus
  }

}
