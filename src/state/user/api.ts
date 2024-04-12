import { fetcher, poster, userPoolSrvcFetcher } from "../../utils/axios"

export const getUserNonce = async (account: string) => {
  const res = await fetcher(`/api/user/nonce/${account}`)

  return res
}

export const airdropV2 = async (account: string, sign: string, totalAmount: string, tokenAddress?: string, type?: number) => {
  
  const res = await poster(`/api/airdrop/airdropV2`, { account, sign, totalAmount, tokenAddress })

  return res
}

export const airdropV2Swap = async (
  account: string, 
  sign: string, 
  addressList: string[], 
  amountList: string[], 
  algTokenAddress?: string, 
  airTokenAddress?: string
) => {
  
  const res = await poster(`/api/airdrop/airdropV2Swap`, { account, sign, addressList, amountList, algTokenAddress, airTokenAddress })

  return res
}

export const getUserInfo = async (account: string) => {
  const res = await fetcher(`/api/user/info/${account}`)
  return res && res.data || {}
}

export const getUserInviteCode = async (account: string) => {
  const res = await fetcher(`/api/user/inviteCode/${account}`)
  return res && res.data || []
}


export const verify2join = async (
  account: string, 
  code: string, 
) => {
  const res = await poster(`/api/user/verifyInviteCode`, { address: account, code })

  return res && res.data || {}
}

export const addUser2Pool = async (
  account: string,
) => {
  const res = await userPoolSrvcFetcher(`/api/userpool/addUser`, { account })

  return res && res.data || {}
}