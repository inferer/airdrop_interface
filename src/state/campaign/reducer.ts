import { createReducer } from '@reduxjs/toolkit'
import { ICampaign, updateCampaignList } from './actions'

import { PROJECTDEMO_ABI } from '../../constants/projectDemo'


export interface CampaignState {
  campaignList: ICampaign[]
}

const initialState: CampaignState = {
  campaignList: [],
}

export default createReducer<CampaignState>(initialState, builder => {

  builder.addCase(updateCampaignList, (state, { payload: { campaignList } }) => {
    state.campaignList = campaignList
  })
  
})
