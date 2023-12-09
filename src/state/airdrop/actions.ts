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
  duration: string,
  startTimestamp: string,
  expireOn: string,
  claimed: string,
  completed?: boolean
}


export const updateAirdropList = createAction<{ airdropList: IAirdrop[] }>('airdrop/updateAirdropList')
export const updateAirdropListOne = createAction<{ airdropList: IAirdrop[] }>('airdrop/updateAirdropListOne')
export const updateUserAirdropConfirmed = createAction<{ airdropList: IAirdrop[] }>('airdrop/updateUserAirdropConfirmed')
