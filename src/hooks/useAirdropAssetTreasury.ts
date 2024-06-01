import { MaxUint256 } from '@ethersproject/constants'
import { AppDispatch } from "../state"
import { useDispatch } from "react-redux"
import { useActiveWeb3React } from "."
import { useAirdropAssetTreasuryContract, useMulticallContract } from "./useContract"
import { useCallback, useEffect, useState } from "react"
import { useAirLabelAllTokens, useAlgLabelAllTokens, useAllTokens, useUSDTAllTokens } from "./Tokens"
import { AirdropAssetTreasury_NETWORKS, AirdropAssetTreasury_ABI } from "../constants/airdropAssetTreasury"
import { BigNumber, Contract, ethers } from "ethers"
import multicall from "../utils/multicall"
import { ChainId, Currency, ETHER, JSBI, Token, TokenAmount } from "@uniswap/sdk"
import { updateProjectLabelLocked, updateProjectUSDTLocked, updateUserAlgTokenLocked, updateUserDepositBalance } from "../state/airdrop/actions"
import { AddressZero_ETH } from "../constants"
import { getUSDTTokenFromAirToken } from "../utils/getTokenList"
import { getERC20Contract, isAddress } from "../utils"
import { useShowToast } from '../state/application/hooks'
import { InfererAirUSDT_ABI } from '../constants/abis/erc20'


export const getAirdropAssetTreasuryAddress = (chainId: number) => {
  // @ts-ignore
  return AirdropAssetTreasury_NETWORKS[chainId as ChainId]
}

export const getProjectLabelLocked = async (multi: Contract, account: string, tokenList: Token[], chainId: number) => {

  const calls: any[] = []
  tokenList.map(token => {
    calls.push({
      address: getAirdropAssetTreasuryAddress(chainId),
      name: 'projectLabelLocked',
      params: [account, token.address]
    })
  })
    

  const res = await multicall(multi, AirdropAssetTreasury_ABI, calls)
  return (res || []).map((item: any, index: number) => {
    return {
      ...tokenList[index],
      // lockedAmount: BigNumber.from(item.toString()).div(BigNumber.from((10 ** tokenList[index].decimals).toString(10))).toString()
      lockedAmount: (Number(item.toString()) / (10 ** tokenList[index].decimals)).toString()
    }
  })
}

export const getProjectUSDTLocked = async (multi: Contract, account: string, tokenList: Token[], chainId: number) => {

  const calls: any[] = []
  tokenList.map(token => {
    calls.push({
      address: getAirdropAssetTreasuryAddress(chainId),
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

export const getAirUSDTInfo = async (multi: Contract, account: string, tokenList: Token[], chainId: number) => {

  const calls: any[] = []
  tokenList.map(token => {
    calls.push({
      address: token.address,
      name: 'totalSupply',
      params: []
    })
  })
  tokenList.map(token => {
    calls.push({
      address: token.address,
      name: 'balanceOf',
      params: [account]
    })
  })
  tokenList.map(token => {
    calls.push({
      address: token.address,
      name: 'getFixedAssetBalance',
      params: []
    })
  })
  tokenList.map(token => {
    calls.push({
      address: token.address,
      name: 'getPoolAssetBalance',
      params: []
    })
  })

  const res = await multicall(multi, InfererAirUSDT_ABI, calls)
  const tokenListLen = tokenList.length
  return (res || []).slice(0, tokenListLen).map((item: any, index: number) => {
    const temp = new TokenAmount(tokenList[index], JSBI.BigInt(item.toString()))
    const temp2 = new TokenAmount(tokenList[index], JSBI.BigInt(res[index + tokenListLen].toString()))
    const temp3 = new TokenAmount(tokenList[index], JSBI.BigInt(res[index + tokenListLen * 2].toString()))
    const temp4 = new TokenAmount(tokenList[index], JSBI.BigInt(res[index + tokenListLen * 3].toString()))
    console.log(item.toString())
    return {
      ...tokenList[index],
      totalSupply: temp.toSignificant(18),
      balanceOf: temp2.toSignificant(18),
      fixedAssetBalance: temp3.toSignificant(18),
      poolAssetBalance: temp4.toSignificant(18),
    }
  })
}
export const getUserAlgTokenLocked = async (multi: Contract, account: string, tokenList: Token[], chainId: number) => {

  const calls: any[] = []
  tokenList.map(token => {
    calls.push({
      address: getAirdropAssetTreasuryAddress(chainId),
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


export const getDepositBalance = async (multi: Contract, account: string, tokenList: Token[], chainId: number) => {

  const calls: any[] = []
  tokenList.map(token => {
    calls.push({
      address: getAirdropAssetTreasuryAddress(chainId),
      // name: 'getDepositBalance',
      // params: [token.address]
      name: 'userDepositBalance',
      params: [account, token.address]
    })
  })
    
  const res = await multicall(multi, AirdropAssetTreasury_ABI, calls)
  return (res || []).map((item: any, index: number) => {
    const temp = item ? new TokenAmount(tokenList[index], JSBI.BigInt(item.toString())) : undefined
    return {
      ...tokenList[index],
      lockedAmount: temp?.toSignificant(6) || '0'
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
  const airUSDTAllTokens = useAllTokens()

  const airdropAssetTreasury = useAirdropAssetTreasuryContract()

  const handleGetAirUSDTInfo = useCallback(async (account: string) => {
    const usdtTokenList = Object.values(airUSDTAllTokens)
    if (account && multi && usdtTokenList.length > 0 && chainId) {
      const list = await getAirUSDTInfo(multi, account, [...usdtTokenList], chainId)
      console.log(list)
      return list
      // dispatch(updateProjectUSDTLocked({ tokenLockedList: list }))
    }
    return []
  }, [multi, airUSDTAllTokens, chainId])

  const handleGetProjectLabelLocked = useCallback(async (account: string) => {
    const airTokenList = Object.values(airLabelAllTokens)
    if (account && multi && airdropAssetTreasury && airTokenList.length > 0 && chainId) {
      const list = await getProjectLabelLocked(multi, account, airTokenList, chainId)

      dispatch(updateProjectLabelLocked({ tokenLockedList: list }))
    }

  }, [multi, airdropAssetTreasury, airLabelAllTokens, chainId])

  const handleGetProjectUSDTLocked = useCallback(async (account: string) => {
    const usdtTokenList = Object.values(usdtAllTokens)
    if (account && multi && airdropAssetTreasury && usdtTokenList.length > 0 && chainId) {
      const list = await getProjectUSDTLocked(multi, account, [AddressZero_ETH[ChainId.MAINNET] ,...usdtTokenList], chainId)
      dispatch(updateProjectUSDTLocked({ tokenLockedList: list }))
    }

  }, [multi, airdropAssetTreasury, usdtAllTokens, chainId])

  const handleGetUserAlgTokenLocked = useCallback(async (account: string) => {
    const algTokenList = Object.values(algLabelAllTokens)
    if (account && multi && airdropAssetTreasury && algTokenList.length > 0 && chainId) {
      const list = await getUserAlgTokenLocked(multi, account, algTokenList, chainId)
      dispatch(updateUserAlgTokenLocked({ tokenLockedList: list }))
    }

  }, [multi, airdropAssetTreasury, algLabelAllTokens, chainId])

  const handleGetDepositBalance = useCallback(async (account: string) => {
    const usdtTokenList = Object.values(usdtAllTokens)
    if (account && multi && airdropAssetTreasury && usdtTokenList.length > 0 && chainId) {
      const ETHToken = AddressZero_ETH[chainId]
      const list = await getDepositBalance(multi, account, [ETHToken, ...usdtTokenList], chainId)
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
        
        let usdtTokenAddress = getUSDTTokenFromAirToken(airTokenAddress, chainId)
        usdtTokenAddress = usdtTokenAddress === 'ETH' ? ethers.constants.AddressZero : usdtTokenAddress
        // const amount = BigNumber.from((Number(value) * (10 ** airToken.decimals)).toString(10)).toString()
        const amount = JSBI.multiply(JSBI.BigInt(parseInt(String(Number(value) * 1000000))), JSBI.BigInt(10 ** (airToken.decimals - 6))).toString()
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
        
        const amount = JSBI.multiply(JSBI.BigInt(parseInt(String(Number(value) * 1000000))), JSBI.BigInt(10 ** (airToken.decimals - 6))).toString()
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
    withdrawStatus,
    handleGetAirUSDTInfo
  }

}

export const getFeeOn = async (multi: Contract, chainId: number, source?: string) => {

  const calls: any[] = []
  calls.push({
    address: getAirdropAssetTreasuryAddress(chainId),
    name: 'getFeeTo',
    params: []
  })
  calls.push({
    address: getAirdropAssetTreasuryAddress(chainId),
    name: 'getFeeOn',
    params: []
  })
  if (source) {
    calls.push({
      address: getAirdropAssetTreasuryAddress(chainId),
      name: 'getDiscountPercentage',
      params: [source]
    })
    calls.push({
      address: getAirdropAssetTreasuryAddress(chainId),
      name: 'getIncomePercentage',
      params: [source]
    })
  }

  const res = await multicall(multi, AirdropAssetTreasury_ABI, calls)

  let feeOn = res[1] && res[1][0] || false
  let feeTo = res[0] && res[0][0] || '0x0000000000000000000000000000000000000000'
  let discountPercentage = res[2] && res[2][0] || '0'
  let incomePercentage = res[3] && res[3][0] || '0'
  let incomeAddress = res[4] && res[4][0] || '0x0000000000000000000000000000000000000000'
  console.log(res)
  return {
    feeOn,
    feeTo,
    discountPercentage,
    incomePercentage,
    incomeAddress
  }

}

export function useAirdropAssetTreasuryFeeOn() {
  const { account, library, chainId } = useActiveWeb3React()
  const multi = useMulticallContract()
  const airdropAssetTreasury = useAirdropAssetTreasuryContract()
  const { handleShow } = useShowToast()
  const [feeStatus, setFeeStatus] = useState(0)

  const handleGetFeeOn = useCallback(async (source?: string) => {
    if (multi && chainId) {
      return await getFeeOn(multi, chainId, source)
    }
    return {

    }

  }, [multi, chainId])
  
  const handleSetFeeTo = useCallback(async (address: string) => {
    if (account && airdropAssetTreasury) {
      try {
        if (!address || !isAddress(address)) {
          alert(`Invalid address`)
          return
        }
        setFeeStatus(1)
        const tx = await airdropAssetTreasury.setFeeTo(address)
        const receipt = await tx.wait()
        console.log(receipt)
        setFeeStatus(2)
        if (receipt.status) {
          alert('Success')
        } else {
          alert('Error')
        }
      } catch (error: any) {
        console.log(error)
        alert(error.data?.message || error.message)
        setFeeStatus(0)
      }
      

    }
  }, [account, airdropAssetTreasury])
  const handleSetFeeOn = useCallback(async (on: boolean) => {
    if (account && airdropAssetTreasury) {
      try {
        setFeeStatus(1)
        const tx = await airdropAssetTreasury.setFeeOn(on)
        const receipt = await tx.wait()
        console.log(receipt)
        setFeeStatus(2)
        if (receipt.status) {
          alert('Success')
          const feeOn = await airdropAssetTreasury.feeOn()
          console.log(feeOn)
        } else {
          alert('Error')
        }
      } catch (error: any) {
        console.log(error)
        alert(error.data?.message || error.message)
        setFeeStatus(0)
      }
    }
  }, [account, airdropAssetTreasury])
  const handleSetsAirdropDiscountPercentage = useCallback(async (source: string, percentage: string) => {
    if (account && airdropAssetTreasury) {
      try {
        setFeeStatus(1)
        const tx = await airdropAssetTreasury.setAirdropDiscountPercentage(source, percentage)
        const receipt = await tx.wait()
        console.log(receipt)
        setFeeStatus(2)
        if (receipt.status) {
          alert('Success')
          
        } else {
          alert('Error')
        }
      } catch (error: any) {
        console.log(error)
        alert(error.data?.message || error.message)
        setFeeStatus(0)
      }
    }
  }, [account, airdropAssetTreasury])

  const handleSetsIncomePercentage = useCallback(async (source: string, percentage: string) => {
    if (account && airdropAssetTreasury) {
      try {
        setFeeStatus(1)
        const tx = await airdropAssetTreasury.setIncomePercentage(source, percentage)
        const receipt = await tx.wait()
        console.log(receipt)
        setFeeStatus(2)
        if (receipt.status) {
          alert('Success')
          
        } else {
          alert('Error')
        }
      } catch (error: any) {
        console.log(error)
        alert(error.data?.message || error.message)
        setFeeStatus(0)
      }
    }
  }, [account, airdropAssetTreasury])

  const handleSetsIncomeAddress = useCallback(async (source: string, address: string) => {
    if (account && airdropAssetTreasury) {
      try {
        setFeeStatus(1)
        const tx = await airdropAssetTreasury.setIncomeAddress(source, address)
        const receipt = await tx.wait()
        console.log(receipt)
        setFeeStatus(2)
        if (receipt.status) {
          alert('Success')
          
        } else {
          alert('Error')
        }
      } catch (error: any) {
        console.log(error)
        alert(error.data?.message || error.message)
        setFeeStatus(0)
      }
    }
  }, [account, airdropAssetTreasury])

  return {
    feeStatus,
    handleSetFeeTo,
    handleSetFeeOn,
    handleGetFeeOn,
    handleSetsAirdropDiscountPercentage,
    handleSetsIncomePercentage,
    handleSetsIncomeAddress
  }
}

export function useAirCampaignAmount() {
  const airdropAssetTreasury = useAirdropAssetTreasuryContract()
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (airdropAssetTreasury) {
      airdropAssetTreasury
        .airCampaignAmount()
        .then((amount: any) => {
          setAmount((Number(amount.toString()) / (10 ** 18)).toString())
        })

    }
    
  }, [airdropAssetTreasury])

  return amount

}