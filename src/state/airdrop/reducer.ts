import { createReducer } from '@reduxjs/toolkit'
import { IAirdrop, IAlgAirdrop, updateAirdropList, updateAirdropListOne, updateUserAirdropConfirmed, updateUserAlgAirdropList, updateUserLabelScore, updateMaxUnits, updateAirTokenPercent, updateProjectLabelLocked, TokenLocked, updateProjectUSDTLocked, updateUserAlgTokenLocked, updateUserAirdropConfirmedByTaskId, updateProjectAirdropList, updateUserDepositBalance, updateCreateContractABI, IABIItem } from './actions'

import { PROJECTDEMO_ABI } from '../../constants/projectDemo'


export interface AirdropState {
  airdropList: IAirdrop[]
  airdropListOne: IAirdrop[]
  userAirdropConfirmedList: IAirdrop[],
  userAlgAirdropList: IAlgAirdrop [],
  userLabelScore: {[key: string]: number},
  maxUnits: number,
  airTokenPercent: number,
  projectTokenLockedList: TokenLocked[],
  projectUSDTLockedList: TokenLocked[],
  userDepositBalanceList: TokenLocked[],
  userAlgTokenLocked: TokenLocked[],
  projectAirdropList: IAirdrop[],
  createContractABI: IABIItem[]
}

const initialState: AirdropState = {
  airdropList: [],
  airdropListOne: [],
  userAirdropConfirmedList: [],
  userAlgAirdropList: [],
  userLabelScore: {},
  maxUnits: 3,
  airTokenPercent: 0,
  projectTokenLockedList: [],
  projectUSDTLockedList: [],
  userAlgTokenLocked: [],
  projectAirdropList: [],
  userDepositBalanceList: [],
  createContractABI: []
}

export default createReducer<AirdropState>(initialState, builder => {
  builder.addCase(updateProjectAirdropList, (state, { payload: { airdropList } }) => {
    state.projectAirdropList = airdropList
  })
  builder.addCase(updateAirdropList, (state, { payload: { airdropList } }) => {
    state.airdropList = airdropList
  })
  builder.addCase(updateAirdropListOne, (state, { payload: { airdropList } }) => {
    state.airdropListOne = airdropList
  })
  builder.addCase(updateUserAirdropConfirmed, (state, { payload: { airdropList } }) => {
    state.userAirdropConfirmedList = airdropList
  })
  builder.addCase(updateUserAirdropConfirmedByTaskId, (state, { payload: { taskIds } }) => {
    console.log(taskIds, state.userAirdropConfirmedList.length)
    const _airdropList = state.userAirdropConfirmedList.map(airdrop => {
      if (taskIds.includes(airdrop.id)) {
        console.log(airdrop)
        return {
          ...airdrop,
          completed: true
        }
      }
      return {
        ...airdrop
      }
    })

    state.userAirdropConfirmedList = _airdropList
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
  builder.addCase(updateProjectLabelLocked, (state, { payload: { tokenLockedList} }) => {
    state.projectTokenLockedList = tokenLockedList
  })
  builder.addCase(updateProjectUSDTLocked, (state, { payload: { tokenLockedList} }) => {
    state.projectUSDTLockedList = tokenLockedList
  })
  builder.addCase(updateUserAlgTokenLocked, (state, { payload: { tokenLockedList} }) => {
    state.userAlgTokenLocked = tokenLockedList
  })
  builder.addCase(updateUserDepositBalance, (state, { payload: { tokenLockedList } }) => {
    state.userDepositBalanceList = tokenLockedList
  })
  builder.addCase(updateCreateContractABI, (state, { payload: { ABIList } }) => {
    state.createContractABI = ABIList
  })
})
