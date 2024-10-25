
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
import { useAirdropReferManager } from "../../hooks/useReferManager";

const ReferList: React.FC<{
  onChecked?: (keys: IAirdrop[]) => void
}> = ({
  onChecked
}) => {
  const router = useRouter()
  const { account } = useActiveWeb3React()
  const { 
    handleReferTo2, 
    confirmStatus,
    approvalState, 
    approve 
  } = useAirdropReferManager()
  
  const { handleGetAirdropReferList, multi, chainId } = useAirdropManager()
  const airdropList = useUserAirdropConfirmedList()

  const userConfirmedList = useMemo(() => {
    return airdropList.filter((airdrop) => !airdrop.completed)
  }, [airdropList])

  useEffect(() => {
    handleGetAirdropReferList()
  }, [handleGetAirdropReferList, multi, chainId, account])

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
              <TableHeadCell className="w-[80px]">
                <div style={{width: 60, wordWrap: 'break-word', fontSize: 14, lineHeight: 'normal'}}>
                  Index Node ID
                </div>
              </TableHeadCell>
              <TableHeadCell className="w-[80px] ">
                <span>Pools</span> 
              </TableHeadCell>
              <TableHeadCell className="w-[126px]">
                <span>Fund</span>
              </TableHeadCell>
              <TableHeadCell className="w-[120px]">
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
                        <TableHeadCell className="w-[80px]">
                          <div >
                            {airdrop.referNodeId}
                          </div>
                        </TableHeadCell>
                        
                        <TableCell className="w-[80px] ">
                          <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px]">
                            {airdrop.label}
                          </div>
                        </TableCell>
                        <TableCell className="w-[126px]">
                          <FundToken airdrop={airdrop} from='user' />
                        </TableCell>
                        <TableCell className="w-[120px]">
                          <div className="flex items-center">
                            <span className="mr-2">{airdrop.airAmount} {airdrop.labelToken?.symbol}</span>
                            <CurrencyLogo currency={airdrop.labelToken} size="24" />
                          </div>
                        </TableCell>
                        <TableCell className="w-[120px]">
                          <div>
                            {airdrop.incomePer}%
                          </div>
                        </TableCell>
                        <TableCell className="w-[120px]">
                          <div>
                            {parseFloat(((Number(airdrop.income ?? '0')) * 100).toFixed(4))}%
                          </div>
                        </TableCell>
                        <TableCell className="w-[143px]">
                          <span>{airdrop.expireOn}</span>
                        </TableCell>
                        <TableCell className="w-[90px]">
                          <div className="flex justify-center w-full">
                            {
                              (airdrop.selfNode && airdrop.selfNode.addr === airdrop.addr) ? 
                                <div className="text-[rgba(63,60,255,0.80)]">{airdrop.referNodeId}</div> : 
                                <div
                                  onClick={e => {
                                    e.stopPropagation()
                                    console.log(airdrop)
                                    if (airdrop.selfNode) {
                                      return
                                    }
                                    // @ts-ignore
                                    handleReferTo2(airdrop.airdropId, airdrop.addr)
                                  }}
                                  style={{ opacity: airdrop.selfNode ? '0.5' : 1}}
                                >
                                  <LazyImage src="/images/airdrop/refer.svg" className="w-[24px] h-[24px]" />
                                </div>
                            }
                            
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