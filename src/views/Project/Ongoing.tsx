import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody } from '../Collect/styleds'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../Collect/Table";
import LazyImage from "../../components/LazyImage";
import { useProjectAirdropList } from "../../state/airdrop/hooks";
import { useRouter } from "next/router";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { Tooltip2, Tooltip3 } from '../../components/Tooltip';
import { formatStringNumber, openBrowser, shortenAddress } from '../../utils';
import useCopyClipboard from '../../hooks/useCopyClipboard';
import CurrencyLogo from '../../components/CurrencyLogo';
import { IAirdrop } from '../../state/airdrop/actions';

export const FundToken2 = ({
  airdrop,
  from
}: {
  airdrop: IAirdrop,
  from?: string
}) => {

  const tipText = useMemo(() => {
    return formatStringNumber(airdrop.offerLocked) + ' ' + airdrop.offerToken?.symbol + ' + ' + formatStringNumber(airdrop.offerLabelLocked) + ' ' + airdrop.labelToken?.symbol
  }, [airdrop])
  return (
    <div className=' relative'>

      {
        Number(airdrop.offerLabelLocked) > 0 ?
        <Tooltip3 text={tipText} >
        <div className=' flex items-center space-x-2 px-2 border rounded border-[rgba(0,0,0,0.06)] w-[88px] h-[36px]'>
          {
            airdrop.offerToken && <CurrencyLogo currency={airdrop.offerToken} />
          }
          <LazyImage src='/images/airdrop/add3.svg' />
          {
            airdrop.labelToken && <CurrencyLogo type={from === 'project' ? 'project' : ''}currency={airdrop.labelToken} size={'24px'} />
          }
          
        </div>
        </Tooltip3> :
        <div className="flex items-center border border-[rgba(85,123,241,0.1)] rounded-lg py-[4px] px-[10px]">
          <div className=" text-[16px] font-fsemibold mr-1">
            {formatStringNumber(airdrop.offerLocked)}
          </div>
          {
            airdrop.offerToken && <CurrencyLogo currency={airdrop.offerToken} size={'20px'} />
          }
          
        </div>
      }
    </div>
  )
}

export const FundToken = ({
  airdrop,
  from
}: {
  airdrop: IAirdrop,
  from?: string
}) => {

  const tipText = useMemo(() => {
    return formatStringNumber(airdrop.offerLocked) + ' ' + airdrop.offerToken?.symbol + ' + ' + formatStringNumber(airdrop.offerLabelLocked) + ' ' + airdrop.labelToken?.symbol
  }, [airdrop])
  return (
    <div className=' relative'>

      {
        Number(airdrop.offerLabelLocked) > 0 ?
        <Tooltip3 text={tipText} >
        <div className=' flex items-center space-x-2 px-2 border rounded border-[rgba(0,0,0,0.06)] w-[88px] h-[36px]'>
          {
            airdrop.offerToken && <CurrencyLogo currency={airdrop.offerToken} />
          }
          <LazyImage src='/images/airdrop/add3.svg' />
          {
            airdrop.labelToken && <CurrencyLogo type={from === 'project' ? 'project' : ''}currency={airdrop.labelToken} size={'24px'} />
          }
          
        </div>
        </Tooltip3> :
        <div className='flex items-center'>
          <span className='mr-2'>{formatStringNumber(airdrop.offerLocked)}</span>
          {
            airdrop.offerToken && <CurrencyLogo currency={airdrop.offerToken} />
          }
        </div>
      }
    </div>
  )
}

export const OngoingList: React.FC<{
  completed?: boolean
}> = ({
  completed
}) => {
  const router = useRouter()
  const [ isCopied, staticCopy ] = useCopyClipboard()
  const { account } = useActiveWeb3React()
  const [algToken, setAlgToken] = useState('')

  const { handleGetUserAirdropList } = useAirdropManager()
  const airdropList = useProjectAirdropList()

  const filterAirdropList = useMemo(() => {
    return airdropList.filter(airdrop => !completed ? !airdrop.completed : airdrop.completed)
  }, [airdropList, completed])

  useEffect(() => {
    if (account) {
      handleGetUserAirdropList(account)
    }
  }, [account])

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
              <TableHeadCell className="w-[118px] ">
                <span>Pool</span> 
              </TableHeadCell>
              <TableHeadCell className="w-[126px]">
                <span>Fund</span>
              </TableHeadCell>
              <TableHeadCell className="w-[182px] ">
                <span>Offer per unit</span> 
              </TableHeadCell>
              
              <TableHeadCell className="w-[234px]">
                <span>Content</span>
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
                filterAirdropList.map(airdrop => {
                  return (
                    <TableRow key={airdrop.airdropId} 
                      onClick={() => {
                        router.push(`/project/${completed ? 'completed' : 'ongoing'}/${airdrop.airdropId}`)
                      }}
                    >
                      <>
                        <TableCell className="flex-1 w-[243px]">
                          <div className=' text-[16px] font-fsemibold text-black flex items-center'>
                            <span className='w-[35px]'>{airdrop.airdropId} </span>
                            <span className="">{airdrop.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[118px] ">
                          <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px]">
                            {airdrop.label}
                          </div>
                        </TableCell>
                        <TableCell className="w-[126px]">
                          <FundToken airdrop={airdrop} from='project' />
                        </TableCell>
                        <TableCell className="w-[182px] ">
                          <div className=' text-[16px] font-fnormal flex items-center'>
                            <div>{airdrop.unit}</div>
                            <div className='mx-2'>{airdrop.labelToken?.symbol}</div>
                            {
                              airdrop.labelToken && <CurrencyLogo type='project' currency={airdrop.labelToken} />
                            }
                            
                          </div>
                          {/* <span className="text-[#79D0C4] font-fmedium">{airdrop.unit}x</span>  */}
                        </TableCell>
                        <TableCell className="w-[234px]">
                          <div className="min-w-[93px] h-[36px] flex items-center rounded border border-[rgba(0,0,0,0.06)] px-2">
                            <LazyImage src="/images/airdrop/chain_airdrop.svg" className=" w-5 h-5 rounded-full shrink-0" />
                            <div className="w-[1px] h-[14px] mx-3 bg-[rgba(0,0,0,0.06)] shrink-0"></div>
                            <div
                              className="shrink-0"
                              onClick={e => {
                                e.stopPropagation()
                                staticCopy(account || '')
                              }}>
                              <Tooltip2 text={isCopied ? 'Copied' : 'Copy' } >
                                <span className=" cursor-pointer text-[16px] font-fnormal text-black">{shortenAddress(airdrop.content?.slice(0, 42))}</span>
                              </Tooltip2>
                            </div>
                            
                          </div>
                        </TableCell>
                        <TableCell className="w-[143px]">
                          <span>{airdrop.expireOn}</span>
                        </TableCell>
                        <TableCell className="w-[95px]">
                          <div className="flex justify-center w-full">
                            <Tooltip2 text={airdrop.landingPage + '?airdropId=' + airdrop.airdropId} >
                              <div
                                onClick={e => {
                                  e.stopPropagation()
                                  airdrop.landingPage && openBrowser(airdrop.landingPage + '?airdropId=' + airdrop.airdropId)
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

  return (
    <div className='w-[1217px] mx-auto'>
      <CollectBody>
        <div className='text-[32px] font-fsemibold mb-10 flex items-center'>
          <LazyImage src='/images/airdrop/ongoing.svg' className=' w-[32px] h-[32px] mr-3' />
          Ongoing Airdrops
        </div>
        <OngoingList />
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Ongoing)
