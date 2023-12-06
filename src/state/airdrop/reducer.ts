import { createReducer } from '@reduxjs/toolkit'
import { IAirdrop, updateAirdropList, updateAirdropListOne } from './actions'


export interface AirdropState {
  airdropList: IAirdrop[]
  airdropListOne: IAirdrop[]
}

const initialState: AirdropState = {
  airdropList: [],
  airdropListOne: []
}

export default createReducer<AirdropState>(initialState, builder => {
  builder.addCase(updateAirdropList, (state, { payload: { airdropList } }) => {
    state.airdropList = airdropList
  })
  builder.addCase(updateAirdropListOne, (state, { payload: { airdropList } }) => {
    state.airdropListOne = airdropList
  })
}
  
)
