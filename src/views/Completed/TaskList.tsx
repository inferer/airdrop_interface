
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../Collect/Table";
import LazyImage from "../../components/LazyImage";
import { useUserAirdropConfirmedList } from "../../state/airdrop/hooks";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { useActiveWeb3React } from "../../hooks";
import CurrencyLogo from "../../components/CurrencyLogo";

const AirdropList: React.FC<{
}> = ({
}) => {
  const { account } = useActiveWeb3React()

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
              <TableHeadCell className="flex-1 w-[250px]">
                <div className=''><span className="">Name</span></div>
              </TableHeadCell>
              <TableHeadCell className="w-[200px] ">
                <span>Pool</span> 
              </TableHeadCell>
              {/* <TableHeadCell className="w-[120px] ">
                <span>Units</span> 
              </TableHeadCell> */}
              <TableHeadCell className="w-[250px]">
                <span>Rewards</span>
              </TableHeadCell>
              <TableHeadCell className="w-[200px]">
                <span>Expire On</span>
              </TableHeadCell>
              <TableHeadCell className="w-[180px]">
                <span>Content</span>
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
                          <div className=' text-[16px] text-black'>
                            <span className="">{airdrop.name}</span>
                            <div className=" text-gray-400">taskId: {airdrop.id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="w-[200px] ">
                          <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px]">
                            {airdrop.label}
                          </div>
                        </TableCell>
                        {/* <TableCell className="w-[120px] ">
                          <span className="text-[#79D0C4] font-fmedium">2x</span> 
                        </TableCell> */}
                        <TableCell className="w-[250px]">
                          <div className="flex items-center">
                            <span className="mr-2">{airdrop.airAmount} {airdrop.labelToken?.symbol}</span>
                            <CurrencyLogo currency={airdrop.labelToken} size="24" />
                          </div>
                        </TableCell>
                        <TableCell className="w-[200px]">
                          <span>{airdrop.expireOn}</span>
                        </TableCell>
                        <TableCell className="w-[180px]">
                          <div className="min-w-[93px] h-[36px] flex items-center rounded border border-[rgba(0,0,0,0.06)] px-2">
                            <LazyImage src="/images/channel/twitter.svg" className=" w-5 h-5 rounded-full shrink-0" />
                            <div className="w-[1px] h-[14px] mx-3 bg-[rgba(0,0,0,0.06)] shrink-0"></div>
                            <span className=" text-[16px] font-fsemibold shrink-0">{airdrop.action}</span>
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