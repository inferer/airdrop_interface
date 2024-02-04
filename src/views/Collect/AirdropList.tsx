
import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "./Table";
import LazyImage from "../../components/LazyImage";
import { useAirdropList, useMaxUnits } from "../../state/airdrop/hooks";
import { useRouter } from "next/router";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { getALgTokenFromAirToken, getAlgLabelTokenByAddress } from "../../utils/getTokenList";
import { useActiveWeb3React } from "../../hooks";
import { useAccountLabelScore } from "../../hooks/useAirdropTokenScore";

const AirdropList: React.FC<{

}> = () => {
  const { account } = useActiveWeb3React()
  const router = useRouter()

  const [algToken, setAlgToken] = useState('')

  const { handleGetAirdropList, handleUpdateAirdropList } = useAirdropManager()
  const airdropList = useAirdropList()
  const maxUnits = useMaxUnits()
  const accountScore = useAccountLabelScore(account || '', router.query.id && router.query.id[0] && getAlgLabelTokenByAddress(router.query.id[0])?.symbol?.slice(4) )
  const filterAirdropList = useMemo(() => {
    return airdropList.filter(airdrop => Number(airdrop.unit) <= maxUnits && !airdrop.completed && (Number(airdrop.labelLocked) - Number(airdrop.claimed) >= accountScore))
  }, [maxUnits, airdropList, accountScore])
  useEffect(() => {
    let _algToken = ''
    if (router.query.id) {
      _algToken = router.query.id[0]
      setAlgToken(_algToken)
      handleGetAirdropList(_algToken)
    }
    return () => {
      handleUpdateAirdropList()
    }
  }, [router])

  return (
    <div>
      <Table>
        <>
          <TableHead>
            <>
              <TableHeadCell className="flex-1 w-[300px]">
                <div className=''>No. <span className="pl-5">Name</span></div>
              </TableHeadCell>
              <TableHeadCell className="w-[135px] ">
                <span>Pool</span> 
              </TableHeadCell>
              <TableHeadCell className="w-[120px] ">
                <span>Units</span> 
              </TableHeadCell>
              <TableHeadCell className="w-[200px]">
                <span>Fund</span>
              </TableHeadCell>
              <TableHeadCell className="w-[180px]">
                <span>Expire On</span>
              </TableHeadCell>
              <TableHeadCell className="w-[140px]">
                <span>Content</span>
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
                        const _algToken = getALgTokenFromAirToken(airdrop.labelToken.address)
                        router.push(`/collect/${algToken || _algToken}/${airdrop.airdropId}`)
                      }}
                    >
                      <>
                        <TableCell className="flex-1 w-[300px]">
                          <div className=' text-[16px] font-fsemibold text-black'>{airdrop.airdropId} <span className="pl-6">{airdrop.name}</span></div>
                        </TableCell>
                        <TableCell className="w-[135px] ">
                          <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px]">
                            {airdrop.label}
                          </div>
                        </TableCell>
                        <TableCell className="w-[120px] ">
                          <span className="text-[#79D0C4] font-fmedium">{airdrop.unit}x</span> 
                        </TableCell>
                        <TableCell className="w-[200px]">
                          <div>
                            <span>{airdrop.offerLocked} {airdrop.offerToken?.symbol || 'ETH' }</span>
                            {
                              Number(airdrop.offerLabelLocked) > 0 && 
                              <>
                                <span className="px-1">+</span>
                                <span>{airdrop.offerLabelLocked} {airdrop.labelToken.symbol}</span>
                              </>
                            }
                            
                          </div>
                          
                        </TableCell>
                        <TableCell className="w-[180px]">
                          <span>{airdrop.expireOn}</span>
                        </TableCell>
                        <TableCell className="w-[140px]">
                          <div className="min-w-[93px] h-[36px] flex items-center rounded border border-[rgba(0,0,0,0.06)] px-2">
                            <LazyImage src="/images/channel/twitter.svg" className=" w-5 h-5 rounded-full shrink-0" />
                            <div className="w-[1px] h-[14px] mx-3 bg-[rgba(0,0,0,0.06)] shrink-0"></div>
                            <span className=" shrink-0 text-[16px] font-fsemibold">{airdrop.action}</span>
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