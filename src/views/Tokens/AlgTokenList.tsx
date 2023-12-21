
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "./Table";
import LazyImage from "../../components/LazyImage";
import { useAirdropList, useUserAlgAirdropList } from "../../state/airdrop/hooks";
import { useRouter } from "next/router";
import { useAirdropManager } from "../../hooks/useAirdropManager";
import { useAirdropTokenScore } from "../../hooks/useAirdropTokenScore";
import { IAlgAirdrop } from "../../state/airdrop/actions";
import { useCurrency } from "../../hooks/Tokens";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { useActiveWeb3React } from "../../hooks";

const AlgTokenListItem: React.FC<{
  algAirdrop: IAlgAirdrop
  claim?: (label: string, tokenAddress: string) => void
}> = ({
  algAirdrop,
  claim
}) => {
  const { account } = useActiveWeb3React()
  const algTokenCurrency = useCurrency(algAirdrop.token.address)
  const algTokenCurrencyAmount = useCurrencyBalance(account ?? undefined, algTokenCurrency ?? undefined)

  return (
    <TableRow key={algAirdrop.token?.address} 
      onClick={() => {
        
      }}
    >
      <>
        <TableCell className="flex-1 w-[120px] ">
          <div className="h-[35px] flex items-center justify-center font-fsemibold text-[16px]">
            { algAirdrop.token?.symbol }
          </div>
        </TableCell>
        <TableCell className="w-[130px] ">
          <span className="font-fmedium">{algTokenCurrencyAmount?.toSignificant(6)}</span> 
        </TableCell>
        <TableCell className="w-[150px]">
          <div className="flex items-center">
            <span>{algAirdrop.unclaimed}</span>
            {
              Number(algAirdrop.unclaimed) > 0 && 
              <button className=" border border-gray-300 p-1 rounded ml-2"
                onClick={e => {
                  e.stopPropagation()
                  claim && claim(algAirdrop.token.symbol || '', algAirdrop.token.address)
                }}
              >Claim</button>
            }
            
          </div>
          
        </TableCell>
        <TableCell className="w-[150px]">
          <span>{algAirdrop.tokenAmount}</span>
        </TableCell>
        
      </>
    </TableRow>
  )
}


const AlgTokenList: React.FC<{

}> = () => {
  const { account } = useActiveWeb3React()

  const userAlgAirdropList = useUserAlgAirdropList()

  const { handleGetAlgTokenList, handleClaim } = useAirdropTokenScore()

  useEffect(() => {

    handleGetAlgTokenList()

  }, [account])


  return (
    <div>
      <Table>
        <>
          <TableHead>
            <>
              <TableHeadCell className="flex-1 w-[120px]">
                <div className=''>Assets</div>
              </TableHeadCell>
              <TableHeadCell className="w-[130px] ">
                <span>Balance</span> 
              </TableHeadCell>
              <TableHeadCell className="w-[150px] ">
                <span>Supplied</span> 
              </TableHeadCell>
              <TableHeadCell className="w-[150px]">
                <span>Supply (next week)</span>
              </TableHeadCell>
            </>
          </TableHead>
          <TableBody>
            <>
              {
                userAlgAirdropList.map(airdrop => {
                  return (
                    <AlgTokenListItem key={airdrop.token?.address} algAirdrop={airdrop} claim={handleClaim} />
                    // <TableRow key={airdrop.token?.address} 
                    //   onClick={() => {
                        
                    //   }}
                    // >
                    //   <>
                    //     <TableCell className="flex-1 w-[120px] ">
                    //       <div className="bg-[rgba(63,60,255,0.05)] rounded-lg h-[35px] px-[8px] flex items-center justify-center text-[rgba(63,60,255,0.80)] font-fmedium text-[16px]">
                    //         { airdrop.token?.symbol }
                    //       </div>
                    //     </TableCell>
                    //     <TableCell className="w-[130px] ">
                    //       <span className="text-[#79D0C4] font-fmedium">2x</span> 
                    //     </TableCell>
                    //     <TableCell className="w-[150px]">
                    //       <div className="flex items-center">
                    //         <span>{airdrop.unclaimed}</span>
                    //         {
                    //           Number(airdrop.unclaimed) > 0 && 
                    //           <button className=" border border-gray-300 p-1 rounded ml-2"
                    //             onClick={e => {
                    //               e.stopPropagation()
                    //               handleClaim(airdrop.token.symbol || '', airdrop.token.address)
                    //             }}
                    //           >Claim</button>
                    //         }
                            
                    //       </div>
                          
                    //     </TableCell>
                    //     <TableCell className="w-[150px]">
                    //       <span>{airdrop.tokenAmount}</span>
                    //     </TableCell>
                        
                    //   </>
                    // </TableRow>
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

export default AlgTokenList