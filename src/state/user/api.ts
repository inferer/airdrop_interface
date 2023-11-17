import { fetcher, poster } from "../../utils/axios"

export const getUserNonce = async (account: string) => {
  const res = await fetcher(`/api/user/nonce/${account}`)

  return res
}

export const airdropV2 = async (account: string, sign: string, totalAmount: string, tokenAddress?: string, type?: number) => {
  
  const res = await poster(`/api/airdrop/airdropV2`, { account, sign, totalAmount })

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