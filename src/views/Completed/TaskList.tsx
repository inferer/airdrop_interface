
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../Collect/Table";
import LazyImage from "../../components/LazyImage";
import { useUserAirdropConfirmedList } from "../../state/airdrop/hooks";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { useActiveWeb3React } from "../../hooks";
import CurrencyLogo from "../../components/CurrencyLogo";
import { Tooltip2 } from "../../components/Tooltip";
import useCopyClipboard from "../../hooks/useCopyClipboard";
import { openBrowser, shortenAddress } from "../../utils";

const AirdropList: React.FC<{
}> = ({
}) => {
  const { account } = useActiveWeb3React()
  const [ isCopied, staticCopy ] = useCopyClipboard()
  const { handleGetUserAirdropConfirmed } = useAirdropManager()
  const airdropList = useUserAirdropConfirmedList()
  const userConfirmedList = useMemo(() => {
    return airdropList.filter((airdrop) => airdrop.completed)
  }, [airdropList])
  useEffect(() => {
    // handleGetAirdropList()
    handleGetUserAirdropConfirmed()
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
              <TableHeadCell className="w-[100px] ">
                <div>TaskID</div> 
              </TableHeadCell>
              <TableHeadCell className="w-[118px] ">
                <span>Pool</span> 
              </TableHeadCell>
              {/* <TableHeadCell className="w-[120px] ">
                <span>Units</span> 
              </TableHeadCell> */}
              <TableHeadCell className="w-[200px]">
                <span>Rewards</span>
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
                userConfirmedList.map((airdrop, index) => {
                  return (
                    <TableRow key={airdrop.airdropId + index} 
                    >
                      <>
                        <TableCell className="flex-1 w-[250px]">
                          <div className='flex items-center text-[16px] font-fsemibold text-black'>
                            <div className="w-[35px]">{index + 1}</div>
                            <div className=''>
                              <span className="">{airdrop.name}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableHeadCell className="w-[100px] ">
                          <div className=" grid grid-cols-2 w-full text-[16px] font-fsemibold text-black">
                            <div className=" text-center">{airdrop.id}</div>
                            <div></div>
                          </div>
                        </TableHeadCell>
                        <TableCell className="w-[118px] ">
                          <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px]">
                            {airdrop.label}
                          </div>
                        </TableCell>
                        {/* <TableCell className="w-[120px] ">
                          <span className="text-[#79D0C4] font-fmedium">2x</span> 
                        </TableCell> */}
                        <TableCell className="w-[200px]">
                          <div className="flex items-center">
                            <span className="mr-2">{airdrop.airAmount} {airdrop.labelToken?.symbol}</span>
                            <CurrencyLogo currency={airdrop.labelToken} size="24" />
                          </div>
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
                            
                            {/* {
                              airdrop.completed ? <div className=" text-gray-400 text-sm">Completed</div> : <CheckedWrap airdrop={airdrop} handleChecked={handleChecked} />
                            } */}
                            <Tooltip2 text={window.location.origin + '/contract-demo?taskId=' + airdrop.id } >
                              <div
                                onClick={e => {
                                  e.stopPropagation()
                                  openBrowser('/contract-demo?taskId=' + airdrop.id)
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

export default AirdropList