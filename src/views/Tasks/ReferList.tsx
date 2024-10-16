
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../Collect/Table";
import LazyImage from "../../components/LazyImage";
import { useUserAirdropConfirmedList } from "../../state/airdrop/hooks";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import CheckBox from "../../components/CheckBox";
import { useActiveWeb3React } from "../../hooks";
import { IAirdrop } from "../../state/airdrop/actions";
import { useAccountLabelScore } from "../../hooks/useAirdropTokenScore";
import CurrencyLogo from "../../components/CurrencyLogo";
import { openBrowser, shortenAddress } from "../../utils";
import useCopyClipboard from "../../hooks/useCopyClipboard";
import { Tooltip2 } from "../../components/Tooltip";
import { useRouter } from "next/router";
import { FundToken } from "../Project/Ongoing";
import { getALgTokenFromAirToken } from "../../utils/getTokenList";

const ReferList: React.FC<{
  onChecked?: (keys: IAirdrop[]) => void
}> = ({
  onChecked
}) => {
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const [ isCopied, staticCopy ] = useCopyClipboard()
  const { handleGetUserAirdropReferList } = useAirdropManager()
  const airdropList = useUserAirdropConfirmedList()
  const userConfirmedList = useMemo(() => {
    return airdropList.filter((airdrop) => !airdrop.completed)
  }, [airdropList])
  useEffect(() => {
    // handleGetAirdropList()
    handleGetUserAirdropReferList(true)
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
                <span>Pools</span> 
              </TableHeadCell>
              <TableHeadCell className="w-[126px]">
                <span>Fund</span>
              </TableHeadCell>
              <TableHeadCell className="w-[200px]">
                <span>Rewards</span>
              </TableHeadCell>
              <TableHeadCell className="w-[120px]">
                <div style={{width: 100, wordWrap: 'break-word', fontSize: 14, lineHeight: 'normal'}}>
                  Refer Percentage
                </div>
              </TableHeadCell>
              <TableHeadCell className="w-[120px]">
                <div style={{width: 100, wordWrap: 'break-word', fontSize: 14, lineHeight: 'normal'}}>
                  Compound Income
                </div>
              </TableHeadCell>
              <TableHeadCell className="w-[143px]">
                <span>Expire On</span>
              </TableHeadCell>
              <TableHeadCell className="w-[90px]">
                <span>Refer Action</span>
              </TableHeadCell>
            </>
          </TableHead>
          <TableBody>
            <>
              {
                userConfirmedList.map((airdrop, index) => {
                  return (
                    <TableRow key={airdrop.airdropId + index} 
                      onClick={() => {
                        router.push(`/user/ongoing/${airdrop.airdropId}?taskId=` + airdrop.id)
                      }}
                    >
                      <>
                        <TableCell className="flex-1 w-[243px]">
                        <div className='flex items-center text-[16px] font-fsemibold text-black'>
                          <div className="w-[35px]">{index + 1}</div>
                          <div className=''>
                            <span className="">{airdrop.name}</span>
                          </div>
                        </div>
                          
                        </TableCell>
                        
                        <TableCell className="w-[118px] ">
                          <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px]">
                            {airdrop.label}
                          </div>
                        </TableCell>
                        <TableCell className="w-[126px]">
                          <FundToken airdrop={airdrop} from='user' />
                        </TableCell>
                        <TableCell className="w-[200px]">
                          <div className="flex items-center">
                            <span className="mr-2">{airdrop.airAmount} {airdrop.labelToken?.symbol}</span>
                            <CurrencyLogo currency={airdrop.labelToken} size="24" />
                          </div>
                        </TableCell>
                        <TableCell className="w-[120px]">
                          <div>
                            50%
                          </div>
                        </TableCell>
                        <TableCell className="w-[120px]">
                          <div>
                            {(Number(airdrop.income ?? '0')) * 100}%
                          </div>
                        </TableCell>
                        <TableCell className="w-[143px]">
                          <span>{airdrop.expireOn}</span>
                        </TableCell>
                        <TableCell className="w-[90px]">
                          <div className="flex justify-center w-full">
                            {/* <Tooltip2 text={airdrop.landingPage + '?taskId=' + airdrop.id} > */}
                              <div
                                onClick={e => {
                                  e.stopPropagation()
                                  const labelToken = airdrop.labelToken
                                  const algToken = getALgTokenFromAirToken(labelToken.address, labelToken.chainId)
                                  console.log(algToken)
                                  const referUrl = window.location.origin + `/user/collect/${algToken}/${airdrop.airdropId}?inviter=` + account
                                  openBrowser(referUrl)
                                }}
                              >
                                <LazyImage src="/images/airdrop/refer.svg" className="w-[24px] h-[24px]" />
                              </div>
                            {/* </Tooltip2> */}
                            
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

const CheckedWrap = ({
  airdrop,
  handleChecked
}: {
  airdrop: IAirdrop,
  handleChecked: (airdrop: IAirdrop, checked: boolean) => void
}) => {
  const { account } = useActiveWeb3React()
  const accountScore = useAccountLabelScore(account || '', airdrop.labelToken?.symbol?.slice(4) || '' )
  return <CheckBox onChange={checked => handleChecked({...airdrop, accountScore}, checked)} /> 
}

export default ReferList