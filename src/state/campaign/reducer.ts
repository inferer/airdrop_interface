import { createReducer } from '@reduxjs/toolkit'
import { ICampaign, updateCampaignList, updateCampaignListOne } from './actions'

import { PROJECTDEMO_ABI } from '../../constants/projectDemo'


export interface CampaignState {
  campaignList: ICampaign[],
  campaignListOne: ICampaign[]
}

const initialState: CampaignState = {
  campaignList: [],
  campaignListOne: [],
}

export default createReducer<CampaignState>(initialState, builder => {

  builder.addCase(updateCampaignList, (state, { payload: { campaignList } }) => {
    state.campaignList = campaignList
  })
  builder.addCase(updateCampaignListOne, (state, { payload: { campaignList } }) => {
    state.campaignListOne = campaignList
  })
  
})
