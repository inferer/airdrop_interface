import { createReducer } from '@reduxjs/toolkit'
import { IAirdrop, updateAirdropList, updateAirdropListOne, updateUserAirdropConfirmed } from './actions'


export interface AirdropState {
  airdropList: IAirdrop[]
  airdropListOne: IAirdrop[]
  userAirdropConfirmedList: IAirdrop[]
}

const initialState: AirdropState = {
  airdropList: [],
  airdropListOne: [],
  userAirdropConfirmedList: []
}

export default createReducer<AirdropState>(initialState, builder => {
  builder.addCase(updateAirdropList, (state, { payload: { airdropList } }) => {
    state.airdropList = airdropList
  })
  builder.addCase(updateAirdropListOne, (state, { payload: { airdropList } }) => {
    state.airdropListOne = airdropList
  })
  builder.addCase(updateUserAirdropConfirmed, (state, { payload: { airdropList } }) => {
    state.userAirdropConfirmedList = airdropList
  })
}
  
)
