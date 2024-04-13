
import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "./Table";
import LazyImage from "../../components/LazyImage";
import { useAirdropList, useMaxUnits } from "../../state/airdrop/hooks";
import { useRouter } from "next/router";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { getALgTokenFromAirToken, getAlgLabelTokenByAddress } from "../../utils/getTokenList";
import { useActiveWeb3React } from "../../hooks";
import { useAccountLabelScore } from "../../hooks/useAirdropTokenScore";
import { useCollectSwapInfo } from "../../state/swap/hooks";
import { Tooltip2 } from "../../components/Tooltip";
import { formatStringNumber, openBrowser, shortenAddress } from "../../utils";
import CurrencyLogo from "../../components/CurrencyLogo";
import useCopyClipboard from "../../hooks/useCopyClipboard";
import { FundToken } from "../Project/Ongoing";

const AirdropList: React.FC<{

}> = () => {
  const { account, chainId } = useActiveWeb3React()
  const router = useRouter()
  const [ isCopied, staticCopy ] = useCopyClipboard()

  const [algToken, setAlgToken] = useState('')

  const { handleGetAirdropList, handleUpdateAirdropList } = useAirdropManager()
  const airdropList = useAirdropList()
  const maxUnits = useMaxUnits()
  const accountScore = useAccountLabelScore(account || '', router.query.action && router.query.action[1] && getAlgLabelTokenByAddress(router.query.action[1])?.symbol?.slice(4) )
  const {
    currencyBalances,
    parsedAmount,
    parsedAmountOUTPUT,
    parsedAmountOUTPUTDerived,
    currencies,
    inputError: collectInputError
  } = useCollectSwapInfo()
  
  const filterAirdropList = useMemo(() => {
    const algAmount = Number(router.query.airAmount ?? 1)
    let filterAirdropList = []
    if (algAmount <= 3) {
      filterAirdropList = airdropList.filter(airdrop => Number(airdrop.unit) <= algAmount)
    } else {
      filterAirdropList = airdropList
    }
    const tempAirdropList = filterAirdropList.filter(airdrop => Number(airdrop.unit) <= maxUnits && !airdrop.completed && (Number(airdrop.labelLocked) - Number(airdrop.claimed) >= Number(airdrop.unit)))
    let tempList = []
    let tempTotal = 0
    if (maxUnits > 0 && algAmount > 0 && tempAirdropList.length > 0) {
      for (let k = 0; k < tempAirdropList.length; k++) {
        if (tempList.length === 0) {
          tempList.push({...tempAirdropList[k]})
          tempTotal += Number(tempAirdropList[k].unit)
        } else {
          if (tempTotal < algAmount) {
            tempList.push({...tempAirdropList[k]})
            tempTotal += Number(tempAirdropList[k].unit)
            if (tempTotal > algAmount) {
              tempList.pop()
              break
            }
          } else {
            break
          }
        }
        
      }
    }
    // return airdropList.filter(airdrop => Number(airdrop.unit) <= maxUnits && !airdrop.completed && (Number(airdrop.labelLocked) - Number(airdrop.claimed) >= accountScore))
    return tempList
  }, [maxUnits, airdropList, parsedAmountOUTPUT])

  useEffect(() => {
    let _algToken = ''
    if (router.query.action) {
      _algToken = router.query.action[1]
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
                filterAirdropList.map(airdrop => {
                  return (
                    <TableRow key={airdrop.airdropId} 
                      onClick={() => {
                        const _algToken = getALgTokenFromAirToken(airdrop.labelToken.address, chainId)
                        router.push(`/user/collect/${algToken || _algToken}/${airdrop.airdropId}`)
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
                          <FundToken airdrop={airdrop} from="user" />
                        </TableCell>
                        
                        <TableCell className="w-[182px] ">
                          <div className=' text-[16px] font-fnormal flex items-center'>
                            <div>{airdrop.unit}</div>
                            <div className='mx-2'>{airdrop.labelToken?.symbol}</div>
                            {
                              airdrop.labelToken && <CurrencyLogo currency={airdrop.labelToken} />
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
                            
                            {/* {
                              airdrop.completed ? <div className=" text-gray-400 text-sm">Completed</div> : <CheckedWrap airdrop={airdrop} handleChecked={handleChecked} />
                            } */}
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

export default AirdropList