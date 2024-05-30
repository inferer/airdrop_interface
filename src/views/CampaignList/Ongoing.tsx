import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody } from '../Collect/styleds'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../Collect/Table";
import LazyImage from "../../components/LazyImage";
import { useRouter } from "next/router";
import { Tooltip2, Tooltip3 } from '../../components/Tooltip';
import { formatStringNumber, openBrowser, shortenAddress } from '../../utils';
import CurrencyLogo from '../../components/CurrencyLogo';
import { ICampaign } from '../../state/campaign/actions';
import { useCampaignManager } from '../../hooks/useCampaignManager';
import { useCampaignList } from '../../state/campaign/hooks';
import { useIsRoleProjectMode } from '../../state/user/hooks';
import { getALgTokenFromAirToken } from '../../utils/getTokenList';

export const FundToken2 = ({
  campaign,
  from
}: {
  campaign: ICampaign,
  from?: string
}) => {

  const tipText = useMemo(() => {
    return formatStringNumber(campaign.offerLocked) + ' ' + campaign.offerToken?.symbol + ' + ' + formatStringNumber(campaign.offerLabelLocked) + ' ' + campaign.labelToken?.symbol
  }, [campaign])
  return (
    <div className=' relative'>

      {
        Number(campaign.offerLabelLocked) > 0 ?
        <Tooltip3 text={tipText} >
        <div className=' flex items-center space-x-2 px-2 border rounded border-[rgba(0,0,0,0.06)] w-[88px] h-[36px]'>
          {
            campaign.offerToken && <CurrencyLogo currency={campaign.offerToken} />
          }
          <LazyImage src='/images/campaign/add3.svg' />
          {
            campaign.labelToken && <CurrencyLogo type={from === 'project' ? 'project' : ''}currency={campaign.labelToken} size={'24px'} />
          }
          
        </div>
        </Tooltip3> :
        <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
          <div className=" text-[16px] font-fsemibold mr-1">
            {formatStringNumber(campaign.offerLocked)}
          </div>
          {
            campaign.offerToken && <CurrencyLogo currency={campaign.offerToken} size={'20px'} />
          }
          
        </div>
      }
    </div>
  )
}

export const FundToken = ({
  campaign,
  from
}: {
  campaign: ICampaign,
  from?: string
}) => {

  const tipText = useMemo(() => {
    return formatStringNumber(campaign.offerLocked) + ' ' + campaign.offerToken?.symbol + ' + ' + formatStringNumber(campaign.offerLabelLocked) + ' ' + campaign.labelToken?.symbol
  }, [campaign])
  return (
    <div className=' relative'>

      {
        Number(campaign.offerLabelLocked) > 0 ?
        <Tooltip3 text={tipText} >
        <div className=' flex items-center space-x-2 px-2 border rounded border-[rgba(0,0,0,0.06)] w-[88px] h-[36px]'>
          {
            campaign.offerToken && <CurrencyLogo currency={campaign.offerToken} />
          }
          <LazyImage src='/images/campaign/add3.svg' />
          {
            campaign.labelToken && <CurrencyLogo type={from === 'project' ? 'project' : ''}currency={campaign.labelToken} size={'24px'} />
          }
          
        </div>
        </Tooltip3> :
        <div className='flex items-center'>
          <span className='mr-2'>{formatStringNumber(campaign.offerLocked)}</span>
          {
            campaign.offerToken && <CurrencyLogo currency={campaign.offerToken} />
          }
        </div>
      }
    </div>
  )
}

export const CampaignList: React.FC<{
  list: ICampaign[]
}> = ({
  list
}) => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const isProjectMode = useIsRoleProjectMode()
  
  return (
    <div>
      <Table>
        <>
          <TableHead>
            <>
              <TableHeadCell className="flex-1 w-[243px]">
                <div className='flex items-center'>
                  <div className="w-[35px]">ID</div>
                  <span className="">Name</span>
                </div>
              </TableHeadCell>
              <TableHeadCell className="w-[170px] ">
                <span>Type</span> 
              </TableHeadCell>
              <TableHeadCell className="w-[126px]">
                <span>Fund</span>
              </TableHeadCell>
              <TableHeadCell className="w-[220px] ">
                <span>Rewards</span> 
              </TableHeadCell>
              
              <TableHeadCell className="w-[163px]">
                <span>Rule</span>
              </TableHeadCell>
              <TableHeadCell className="w-[143px]">
                <span>Expire On</span>
              </TableHeadCell>
              <TableHeadCell className="w-[95px]">
                <span>Landing Page</span>
              </TableHeadCell>
            </>
          </TableHead>
          <TableBody>
            <>
              {
                list.map(campaign => {
                  return (
                    <TableRow key={campaign.campaignId} 
                      onClick={() => {
                        const _algToken = getALgTokenFromAirToken(campaign.labelToken.address, chainId)
                        router.push( isProjectMode ? `/project/campaign/${campaign.campaignId}` : `/user/campaign/${_algToken}/${campaign.campaignId}`)
                      }}
                    >
                      <>
                        <TableCell className="flex-1 w-[243px]">
                          <div className=' text-[16px] font-fsemibold text-black flex items-center'>
                            <span className='w-[35px]'>{campaign.campaignId} </span>
                            <span className="">{campaign.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[170px] ">
                          <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px] capitalize">
                            {campaign.action}
                          </div>
                        </TableCell>
                        <TableCell className="w-[126px]">
                          {/* <FundToken campaign={campaign} from='project' /> */}
                          <div className=' text-[16px] font-fnormal flex items-center'>
                            <div className='mr-2'>{formatStringNumber(campaign.offerLocked)}</div>
                            {/* <div className='mx-2'>{campaign.offerToken?.symbol}</div> */}
                            {
                              campaign.offerToken && <CurrencyLogo currency={campaign.offerToken} />
                            }
                          </div>
                        </TableCell>
                        <TableCell className="w-[220px] ">
                          <div className=' text-[16px] font-fnormal flex items-center'>
                            <div>{formatStringNumber(campaign.labelLocked)}</div>
                            <div className='mx-2'>{campaign.labelToken?.symbol}</div>
                            {
                              campaign.labelToken && <CurrencyLogo type='create' currency={campaign.labelToken} />
                            }
                          </div>
                          {/* <span className="text-[#79D0C4] font-fmedium">{campaign.unit}x</span>  */}
                        </TableCell>
                        <TableCell className="w-[163px]">
                          <div className="min-w-[93px] h-[36px] flex items-center rounded border border-[rgba(0,0,0,0.06)] px-2">
                            <LazyImage src="/images/airdrop/chain_airdrop.svg" className=" w-5 h-5 rounded-full shrink-0" />
                            <div className="w-[1px] h-[14px] mx-3 bg-[rgba(0,0,0,0.06)] shrink-0"></div>
                            <div>By Order</div>
                            
                          </div>
                        </TableCell>
                        <TableCell className="w-[143px]">
                          <span>{campaign.expireOn}</span>
                        </TableCell>
                        <TableCell className="w-[95px]">
                          <div className="flex justify-center w-full">
                            <Tooltip2 text={campaign.landingPage + '?campaignId=' + campaign.campaignId} >
                              <div
                                onClick={e => {
                                  e.stopPropagation()
                                  campaign.landingPage && openBrowser(campaign.landingPage + '?campaignId=' + campaign.campaignId)
                                }}
                              >
                                <LazyImage src="/images/airdrop/landing.svg" className="w-[24px] h-[24px]" />
                              </div>
                            </Tooltip2>
                            
                          </div>
                        </TableCell>
                      </>
                    </TableRow>
                  )
                })
              }

            </>
          </TableBody>
        </>
      </Table>
    </div>
  )
}



function Ongoing() {
  const { account } = useActiveWeb3React()
  const [ completed, setCompleted ] = useState(false)
  const { handleGetUserCampaignList } = useCampaignManager()

  const campaignList = useCampaignList()

  const filterCampaignList = useMemo(() => {
    return campaignList.filter(campaign => !completed ? !campaign.completed : campaign.completed)
  }, [campaignList, completed])

  useEffect(() => {
    if (account) {
      handleGetUserCampaignList(account)
    }
  }, [account])
  return (
    <div className='w-[1217px] mx-auto'>
      <CollectBody>
        <div className='text-[32px] font-fsemibold mb-10 flex items-center'>
          <LazyImage src='/images/campaign/campaign.svg' className=' w-[32px] h-[32px] mr-3' />
          Campaigns
        </div>
        <CampaignList list={filterCampaignList} />
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Ongoing)
