import { MaxUint256 } from '@ethersproject/constants'
import { AppDispatch } from "../state"
import { useDispatch } from "react-redux"
import { useActiveWeb3React } from "."
import { useAirdropAssetTreasuryContract, useMulticallContract } from "./useContract"
import { useCallback, useState } from "react"
import { useAirLabelAllTokens, useAlgLabelAllTokens, useUSDTAllTokens } from "./Tokens"
import { AirdropAssetTreasury_NETWORKS, AirdropAssetTreasury_ABI } from "../constants/airdropAssetTreasury"
import { NETWORK_CHAIN_ID } from "../connectors"
import { BigNumber, Contract, ethers } from "ethers"
import multicall from "../utils/multicall"
import { ChainId, Currency, ETHER, JSBI, Token, TokenAmount } from "@uniswap/sdk"
import { updateProjectLabelLocked, updateProjectUSDTLocked, updateUserAlgTokenLocked, updateUserDepositBalance } from "../state/airdrop/actions"
import { AddressZero_ETH } from "../constants"
import { getUSDTTokenFromAirToken } from "../utils/getTokenList"
import { getERC20Contract } from "../utils"
import { useShowToast } from '../state/application/hooks'


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
      // lockedAmount: BigNumber.from(item.toString()).div(BigNumber.from((10 ** tokenList[index].decimals).toString(10))).toString()
      lockedAmount: (Number(item.toString()) / (10 ** tokenList[index].decimals)).toFixed(4)
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

export const getDepositBalance = async (multi: Contract, account: string, tokenList: Token[]) => {

  const calls: any[] = []
  tokenList.map(token => {
    calls.push({
      address: getAirdropAssetTreasuryAddress(),
      // name: 'getDepositBalance',
      // params: [token.address]
      name: 'userDepositBalance',
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
  const { account, library, chainId } = useActiveWeb3React()

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

  }, [multi, airdropAssetTreasury, algLabelAllTokens])

  const handleGetDepositBalance = useCallback(async (account: string) => {
    const usdtTokenList = Object.values(usdtAllTokens)
    if (account && multi && airdropAssetTreasury && usdtTokenList.length > 0 && chainId) {
      const ETHToken = AddressZero_ETH[chainId]
      const list = await getDepositBalance(multi, account, [ETHToken, ...usdtTokenList])
      console.log(list)
      dispatch(updateUserDepositBalance({ tokenLockedList: list }))
    }

  }, [multi, airdropAssetTreasury, usdtAllTokens, chainId])

  const [withdrawStatus, setWithdrawStatus] = useState(0)
  const { handleShow } = useShowToast()
  const handleUserWithdraw = useCallback(async (value: string, airToken: Currency) => {
    if (account && airdropAssetTreasury && library && chainId) {
      setWithdrawStatus(1)
      try {
        // @ts-ignore
        const airTokenAddress = airToken.address
        const tokenContract = getERC20Contract(airTokenAddress, library, account)
        const spender = AirdropAssetTreasury_NETWORKS[chainId]
        const allowance = await tokenContract.allowance(account, spender)
        
        let usdtTokenAddress = getUSDTTokenFromAirToken(airTokenAddress)
        usdtTokenAddress = usdtTokenAddress === 'ETH' ? ethers.constants.AddressZero : usdtTokenAddress
        const amount = BigNumber.from((Number(value) * (10 ** airToken.decimals)).toString(10)).toString()
        console.log(airToken, usdtTokenAddress, BigNumber.from((Number(value) * (10 ** airToken.decimals)).toString(10)).toString())
        console.log(allowance.toString())
        let approved = false
        if (Number(allowance) < Number(amount)) {
          const approveTx = await tokenContract.approve(spender, MaxUint256)
          const receipt = await approveTx.wait()
          if (receipt.status) {
            approved = true
          } else {
            handleShow({ type: 'error', content: `Approve: error.`, title: 'Error' })
          }
        } else {
          approved = true
        }
        if (approved) {
          const tx = await airdropAssetTreasury.userWithdraw(airTokenAddress, amount)
          const receipt = await tx.wait()
          if (receipt.status) {
            setWithdrawStatus(2)
            handleShow({ type: 'success', content: `Withdraw ${value} ${airToken.symbol} tokens successfully.`, title: 'Success' })
          } else {
            handleShow({ type: 'error', content: `Fail to withdraw ${airToken.symbol} token.`, title: 'Error' })
          }
        }
        // // setTimeout(() => {
        // //   setWithdrawStatus(2)
        // // }, 1500)
        
      } catch(err: any) {
        console.log(err)
        handleShow({ type: 'error', content: `Fail to withdraw ${airToken.symbol} token.`, title: 'Error' })
        setWithdrawStatus(0)
      }
    }
  }, [account, library, chainId, airdropAssetTreasury])
  const handleUserDeposit = useCallback(async (value: string, airToken: Currency) => {
    if (account && airdropAssetTreasury && library && chainId) {
      setWithdrawStatus(1)
      if (Number(value) <= 0) {
        setWithdrawStatus(2)
        handleShow({ type: 'error', content: `Invalid deposit value!`, title: 'Error' })
        setTimeout(() => {
          setWithdrawStatus(0)
        }, 300)
        return
      }
      try {
        // @ts-ignore
        const airTokenAddress = airToken.symbol === 'ETH' ? ethers.constants.AddressZero : airToken.address
        let allowance = MaxUint256
        let tokenContract
        const spender = AirdropAssetTreasury_NETWORKS[chainId]
        if (airTokenAddress !== ethers.constants.AddressZero) {
          tokenContract = getERC20Contract(airTokenAddress, library, account)
          allowance = await tokenContract.allowance(account, spender)
        }
        
        const amount = BigNumber.from((Number(value) * (10 ** airToken.decimals)).toString(10)).toString()
        console.log(airToken, BigNumber.from((Number(value) * (10 ** airToken.decimals)).toString(10)).toString())
        console.log(allowance.toString())
        let approved = false
        if (Number(allowance) < Number(amount) && tokenContract) {
          const approveTx = await tokenContract.approve(spender, MaxUint256)
          const receipt = await approveTx.wait()
          if (receipt.status) {
            approved = true
          } else {
            handleShow({ type: 'error', content: `Approve: error.`, title: 'Error' })
          }
        } else {
          approved = true
        }
        if (approved) {
          const tx = await airdropAssetTreasury.userDeposit(airTokenAddress, amount, { value: airToken.symbol === 'ETH' ? amount : '0' })
          const receipt = await tx.wait()
          if (receipt.status) {
            setWithdrawStatus(2)
            handleShow({ type: 'success', content: `Deposit ${value} ${airToken.symbol} tokens successfully.`, title: 'Success' })
          } else {
            handleShow({ type: 'error', content: `Fail to Deposit ${airToken.symbol} token.`, title: 'Error' })
          }
        }
        
      } catch(err: any) {
        console.log(err)
        handleShow({ type: 'error', content: `Fail to Deposit ${airToken.symbol} token.`, title: 'Error' })
        setWithdrawStatus(0)
      }
    }
  }, [account, library, chainId, airdropAssetTreasury])

  return {
    handleGetProjectLabelLocked,
    handleGetProjectUSDTLocked,
    handleGetUserAlgTokenLocked,
    handleGetDepositBalance,
    handleUserWithdraw,
    handleUserDeposit,
    withdrawStatus
  }

}