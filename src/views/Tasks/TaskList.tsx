
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

const AirdropList: React.FC<{
  onChecked?: (keys: IAirdrop[]) => void
}> = ({
  onChecked
}) => {
  const { account } = useActiveWeb3React()

  const { handleGetUserAirdropConfirmed } = useAirdropManager()
  const airdropList = useUserAirdropConfirmedList()
  const userConfirmedList = useMemo(() => {
    return airdropList.filter((airdrop) => !airdrop.completed)
  }, [airdropList])
  useEffect(() => {
    // handleGetAirdropList()
    handleGetUserAirdropConfirmed(true)
  }, [account])
  
  const [checkList, setCheckList ] = useState<IAirdrop[]>([])
  const handleChecked = useCallback((checkedAirdrop, checked) => {
    const index = checkList.findIndex(checkId => checkId.id === checkedAirdrop.id)
    if (!checked && index > -1) {
      checkList.splice(index, 1)
    }
    if (checked && index < 0) {
      checkList.push(checkedAirdrop)
    }
    onChecked && onChecked([...checkList])
    setCheckList(checkList)
  }, [checkList, userConfirmedList])
  
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
                <span>Rewards</span>
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
                        <TableCell className="w-[135px] ">
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
                        <TableCell className="w-[180px]">
                          <span>{airdrop.expireOn}</span>
                        </TableCell>
                        <TableCell className="w-[140px]">
                          <div className="min-w-[93px] h-[36px] flex items-center rounded border border-[rgba(0,0,0,0.06)] px-2">
                            <LazyImage src="/images/channel/twitter.svg" className=" w-5 h-5 rounded-full shrink-0" />
                            <div className="w-[1px] h-[14px] mx-3 bg-[rgba(0,0,0,0.06)] shrink-0"></div>
                            <span className=" text-[16px] font-fsemibold shrink-0">{airdrop.action}</span>
                          </div>
                        </TableCell>
                        <TableCell className="w-[74px]">
                          <div className="flex justify-center w-full">
                            
                            {
                              airdrop.completed ? <div className=" text-gray-400 text-sm">Completed</div> : <CheckedWrap airdrop={airdrop} handleChecked={handleChecked} />
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

export default AirdropList