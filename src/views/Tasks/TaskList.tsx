
import React, { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "../Collect/Table";
import LazyImage from "../../components/LazyImage";
import { useUserAirdropConfirmedList } from "../../state/airdrop/hooks";
import router from "next/router";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import CheckBox from "../../components/CheckBox";
import { useActiveWeb3React } from "../../hooks";

const AirdropList: React.FC<{
  onChecked?: (keys: string[]) => void
}> = ({
  onChecked
}) => {
  const { account } = useActiveWeb3React()

  const { handleGetAirdropList, handleGetUserAirdropConfirmed } = useAirdropManager()
  const airdropList = useUserAirdropConfirmedList()

  useEffect(() => {
    // handleGetAirdropList()
    handleGetUserAirdropConfirmed()
  }, [account])
  
  const [checkList, setCheckList ] = useState<string[]>([])
  const handleChecked = useCallback((id, checked) => {
    const index = checkList.findIndex(checkId => checkId === id)
    if (!checked && index > -1) {
      checkList.splice(index, 1)
    }
    if (checked && index < 0) {
      checkList.push(id)
    }
    onChecked && onChecked(checkList)
    setCheckList(checkList)
  }, [checkList])
  console.log(airdropList[0])
  return (
    <div>
      <Table>
        <>
          <TableHead>
            <>
              <TableHeadCell className="flex-1 w-[250px]">
                <div className=''><span className="">Name</span></div>
              </TableHeadCell>
              <TableHeadCell className="w-[135px] ">
                <span>Inferer Labels</span> 
              </TableHeadCell>
              {/* <TableHeadCell className="w-[120px] ">
                <span>Units</span> 
              </TableHeadCell> */}
              <TableHeadCell className="w-[200px]">
                <span>Fund</span>
              </TableHeadCell>
              <TableHeadCell className="w-[180px]">
                <span>Expire On</span>
              </TableHeadCell>
              <TableHeadCell className="w-[140px]">
                <span>Content</span>
              </TableHeadCell>
              <TableHeadCell className="w-[74px]">
                <span>Complete</span>
              </TableHeadCell>
            </>
          </TableHead>
          <TableBody>
            <>
              {
                airdropList.map((airdrop, index) => {
                  return (
                    <TableRow key={airdrop.airdropId + index} 
                    >
                      <>
                        <TableCell className="flex-1 w-[250px]">
                          <div className=' text-[16px] text-black'>
                            <span className="">{airdrop.name}</span>
                            <div className=" text-gray-400">airdropId: {airdrop.airdropId}</div>
                          </div>
                        </TableCell>
                        <TableCell className="w-[135px] ">
                          <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px]">
                            {airdrop.label}
                          </div>
                        </TableCell>
                        {/* <TableCell className="w-[120px] ">
                          <span className="text-[#79D0C4] font-fmedium">2x</span> 
                        </TableCell> */}
                        <TableCell className="w-[200px]">
                          <span>{airdrop.offerLocked} {airdrop.offerToken.symbol}</span>
                        </TableCell>
                        <TableCell className="w-[180px]">
                          <span>{airdrop.expireOn}</span>
                        </TableCell>
                        <TableCell className="w-[140px]">
                          <div className="w-[93px] h-[36px] flex justify-between items-center rounded border border-[rgba(0,0,0,0.06)] px-2">
                            <LazyImage src="/images/channel/twitter.svg" className=" w-5 h-5 rounded-full" />
                            <div className="w-[1px] h-[14px] bg-[rgba(0,0,0,0.06)]"></div>
                            <span className=" text-[16px] font-fsemibold">Like</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[74px]">
                          <div className="flex justify-center w-full">
                            
                            {
                              airdrop.completed ? <div className=" text-gray-400 text-sm">Completed</div> : <CheckBox onChange={checked => handleChecked(airdrop.airdropId, checked)} /> 
                            }
                            
                          </div>
                        </TableCell>
                      </>
                    </TableRow>
                  )
                })
              }
              {/* <TableRow >
                <>
                  <TableCell className="flex-1 w-[300px]">
                    <div className=' text-[16px] text-black'>01 <span className="pl-6">Azuki new users plan</span></div>
                  </TableCell>
                  <TableCell className="w-[135px] ">
                    <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px]">
                      Social
                    </div>
                  </TableCell>
                  <TableCell className="w-[120px] ">
                    <span className="text-[#79D0C4] font-fmedium">2x</span> 
                  </TableCell>
                  <TableCell className="w-[200px]">
                    <span>1,000 USDC</span>
                  </TableCell>
                  <TableCell className="w-[180px]">
                    <span>30/11/2023</span>
                  </TableCell>
                  <TableCell className="w-[140px]">
                    <div className="w-[93px] h-[36px] flex justify-between items-center rounded border border-[rgba(0,0,0,0.06)] px-2">
                      <LazyImage src="/images/channel/twitter.svg" className=" w-5 h-5 rounded-full" />
                      <div className="w-[1px] h-[14px] bg-[rgba(0,0,0,0.06)]"></div>
                      <span className=" text-[16px] font-fsemibold">Like</span>
                    </div>
                  </TableCell>
                </>
              </TableRow> */}

            </>
          </TableBody>
        </>
      </Table>
    </div>
  )
}

export default AirdropList