import { createReducer } from '@reduxjs/toolkit'
import { ICampaign, ICampaignApplyVote, updateCampaignApplyVoteList, updateCampaignList, updateCampaignListOne } from './actions'

import { PROJECTDEMO_ABI } from '../../constants/projectDemo'


export interface CampaignState {
  campaignList: ICampaign[],
  campaignListOne: ICampaign[],
  campaignApplyVoteList: {[campaignId: string]: ICampaignApplyVote[]} 
}

const initialState: CampaignState = {
  campaignList: [],
  campaignListOne: [],
  campaignApplyVoteList: {}
}

export default createReducer<CampaignState>(initialState, builder => {

  builder.addCase(updateCampaignList, (state, { payload: { campaignList } }) => {
    state.campaignList = campaignList
  })
  builder.addCase(updateCampaignListOne, (state, { payload: { campaignList } }) => {
    state.campaignListOne = campaignList
  })
  builder.addCase(updateCampaignApplyVoteList, (state, { payload: { campaignId, campaignApplyVoteList } }) => {
    state.campaignApplyVoteList[campaignId] = campaignApplyVoteList
  })
  
})
