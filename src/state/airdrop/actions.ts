import { createAction } from '@reduxjs/toolkit'
import { Token } from '@uniswap/sdk'

export interface IAirdrop {
  id: string,
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
  offerLabelLocked: string,
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

export type TokenLocked = {
  "decimals": number,
  "symbol": string,
  "name": string,
  "chainId": number,
  "address": string
  "lockedAmount": string
}


export const updateAirdropList = createAction<{ airdropList: IAirdrop[] }>('airdrop/updateAirdropList')
export const updateAirdropListOne = createAction<{ airdropList: IAirdrop[] }>('airdrop/updateAirdropListOne')
export const updateUserAirdropConfirmed = createAction<{ airdropList: IAirdrop[] }>('airdrop/updateUserAirdropConfirmed')
export const updateUserAirdropConfirmedByTaskId = createAction<{ taskIds: string[] }>('airdrop/updateUserAirdropConfirmedByTaskId')
export const updateUserAlgAirdropList = createAction<{ algAirdropList: IAlgAirdrop[] }>('airdrop/updateUserAlgAirdropList')
export const updateUserLabelScore = createAction<{ key: string, score: number }>('airdrop/updateUserLabelScore')
export const updateMaxUnits = createAction<{ units: number }>('airdrop/updateMaxUnits')
export const updateAirTokenPercent = createAction<{ percent: number }>('airdrop/updateAirTokenPercent')
export const updateProjectLabelLocked = createAction<{ tokenLockedList: TokenLocked[] }>('airdrop/updateProjectLabelLocked')
export const updateProjectUSDTLocked = createAction<{ tokenLockedList: TokenLocked[] }>('airdrop/updateProjectUSDTLocked')
export const updateUserAlgTokenLocked = createAction<{ tokenLockedList: TokenLocked[] }>('airdrop/updateUserAlgTokenLocked')
