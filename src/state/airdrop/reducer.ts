import { createReducer } from '@reduxjs/toolkit'
import { IAirdrop, IAlgAirdrop, updateAirdropList, updateAirdropListOne, updateUserAirdropConfirmed, updateUserAlgAirdropList, updateUserLabelScore, updateMaxUnits, updateAirTokenPercent } from './actions'


export interface AirdropState {
  airdropList: IAirdrop[]
  airdropListOne: IAirdrop[]
  userAirdropConfirmedList: IAirdrop[],
  userAlgAirdropList: IAlgAirdrop [],
  userLabelScore: {[key: string]: number},
  maxUnits: number,
  airTokenPercent: number,
}

const initialState: AirdropState = {
  airdropList: [],
  airdropListOne: [],
  userAirdropConfirmedList: [],
  userAlgAirdropList: [],
  userLabelScore: {},
  maxUnits: 3,
  airTokenPercent: 0
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
  builder.addCase(updateUserLabelScore, (state, { payload: { key, score } }) => {
    state.userLabelScore[key] = score
  })
  builder.addCase(updateMaxUnits, (state, { payload: { units} }) => {
    state.maxUnits = units
  })
  builder.addCase(updateAirTokenPercent, (state, { payload: { percent} }) => {
    state.airTokenPercent = percent
  })
})
