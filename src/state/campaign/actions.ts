import { createAction } from '@reduxjs/toolkit'
import { Token } from '@uniswap/sdk'

export interface ICampaign {
  id: string,
  campaignId: string,
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
  completed?: boolean,
  accountScore?: number
  airAmount?: number,
  chain?: string,
  landingPage?: string,
  parameterInfo?: any[]
  realCompleted?: boolean,
  userCompleted?: boolean,
  isExpired?: boolean,
  completedClaimed?: string
}

export interface ICampaignApplyVote {
  campaignId: string,
  applyUser: string,
  arwId: string,
  voteCount: string,
  voteUser: string[]
}


export const updateCampaignList = createAction<{ campaignList: ICampaign[] }>('campaign/updateCampaignList')
export const updateCampaignListOne = createAction<{ campaignList: ICampaign[] }>('campaign/updateCampaignListOne')
export const updateCampaignApplyVoteList = createAction<{campaignId: string, campaignApplyVoteList: ICampaignApplyVote[] }>('campaign/updateCampaignApplyVoteList')

