import { createReducer } from '@reduxjs/toolkit'
import { IAirdrop, IAlgAirdrop, updateAirdropList, updateAirdropListOne, updateUserAirdropConfirmed, updateUserAlgAirdropList } from './actions'


export interface AirdropState {
  airdropList: IAirdrop[]
  airdropListOne: IAirdrop[]
  userAirdropConfirmedList: IAirdrop[],
  userAlgAirdropList: IAlgAirdrop []
}

const initialState: AirdropState = {
  airdropList: [],
  airdropListOne: [],
  userAirdropConfirmedList: [],
  userAlgAirdropList: []
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
  builder.addCase(updateUserAlgAirdropList, (state, { payload: { algAirdropList } }) => {
    state.userAlgAirdropList = algAirdropList
  })
}
  
)
