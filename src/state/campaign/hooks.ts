import { Currency, CurrencyAmount, JSBI, Pair, Percent, TokenAmount } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { ICampaign } from './actions'
import { ethers } from 'ethers'


export function useCampaignList() {
  return useSelector<AppState, AppState['campaign']['campaignList']>(state => state.campaign.campaignList)
}


export function useCampaignList0(campaignId: string | undefined) {
  const campaignListOne = useSelector<AppState, AppState['campaign']['campaignListOne']>(state => state.campaign.campaignListOne)
  return useMemo(() => {
    return  campaignListOne.find(campaign => campaign.campaignId === campaignId ) ?? {} as ICampaign
  }, [campaignListOne, campaignId])
}
