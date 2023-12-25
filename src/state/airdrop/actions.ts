import { createAction } from '@reduxjs/toolkit'
import { Token } from '@uniswap/sdk'

export interface IAirdrop {
  airdropId: string,
  name: string,
  label: string,
  channel: string,
  action: string,
  content: string,
  offerToken: Token,
  offerAirToken: string,
  labelToken: Token,
  sender: string,
  offerLocked: string,
  labelLocked: string,
  unit: string,
  duration: string,
  startTimestamp: string,
  expireOn: string,
  claimed: string,
  completed?: boolean
}
export interface IAlgAirdrop {
  claimed: string,
  latestTimestamp: string,
  claimTokenTimestamp: string,
  tokenTimestamp: string,
  tokenAmount: string,
  tokenTotalAmount: string,
  unclaimed: string,
  token: Token
}


export const updateAirdropList = createAction<{ airdropList: IAirdrop[] }>('airdrop/updateAirdropList')
export const updateAirdropListOne = createAction<{ airdropList: IAirdrop[] }>('airdrop/updateAirdropListOne')
export const updateUserAirdropConfirmed = createAction<{ airdropList: IAirdrop[] }>('airdrop/updateUserAirdropConfirmed')
export const updateUserAlgAirdropList = createAction<{ algAirdropList: IAlgAirdrop[] }>('airdrop/updateUserAlgAirdropList')
export const updateUserLabelScore = createAction<{ key: string, score: number }>('airdrop/updateUserLabelScore')
