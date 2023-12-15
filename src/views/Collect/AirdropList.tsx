
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "./Table";
import LazyImage from "../../components/LazyImage";
import { useAirdropList } from "../../state/airdrop/hooks";
import { useRouter } from "next/router";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { getALgTokenFromAirToken } from "../../utils/getTokenList";

const AirdropList: React.FC<{

}> = () => {
  const router = useRouter()

  const [algToken, setAlgToken] = useState('')

  const { handleGetAirdropList } = useAirdropManager()
  const airdropList = useAirdropList()

  useEffect(() => {
    let _algToken = ''
    if (router.query.id) {
      _algToken = router.query.id[0]
    }
    setAlgToken(_algToken)
    handleGetAirdropList(_algToken)
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
                airdropList.map(airdrop => {
                  return (
                    <TableRow key={airdrop.airdropId} 
                      onClick={() => {
                        const _algToken = getALgTokenFromAirToken(airdrop.labelToken.address)
                        router.push(`/collect/${algToken || _algToken}/${airdrop.airdropId}`)
                      }}
                    >
                      <>
                        <TableCell className="flex-1 w-[300px]">
                          <div className=' text-[16px] text-black'>{airdrop.airdropId} <span className="pl-6">{airdrop.name}</span></div>
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