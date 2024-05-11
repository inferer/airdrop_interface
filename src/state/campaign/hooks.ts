import { Currency, CurrencyAmount, JSBI, Pair, Percent, TokenAmount } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { ICampaign } from './actions'
import { ethers } from 'ethers'


export function useCampaignList() {
  return useSelector<AppState, AppState['campaign']['campaignList']>(state => state.campaign.campaignList)
}
