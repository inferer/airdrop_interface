
import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "./Table";
import { useRouter } from "next/router";
import { useAirdropTokenScore } from "../../hooks/useAirdropTokenScore";
import { useAlgLabelAllTokens, useCurrency } from "../../hooks/Tokens";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { useActiveWeb3React } from "../../hooks";
import { Currency } from "@uniswap/sdk";
import CurrencyLogo from "../../components/CurrencyLogo";
import { useAlgAirdrop } from "../../state/airdrop/hooks";

const AlgTokenListItem: React.FC<{
  algToken: Currency,
  claim?: (label: string, tokenAddress: string) => void
}> = ({
  algToken,
  claim
}) => {
  const { account } = useActiveWeb3React()
  const balance = useCurrencyBalance(account ?? undefined, algToken)
  // @ts-ignore
  const algAirdrop = useAlgAirdrop(algToken.address)

  return (
    <TableRow key={algToken.symbol} 
      onClick={() => {
        
      }}
    >
      <>
        <TableCell className="flex-1 w-[120px] ">
          <div className="h-[35px] flex items-center justify-center font-fsemibold text-[16px]">
            <CurrencyLogo currency={algToken} />
            <div className="pl-2">
              { algToken?.symbol }
            </div>
            
          </div>
        </TableCell>
        <TableCell className="w-[130px] ">
          <span className="font-fmedium">{balance?.toSignificant(6)}</span> 
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
  const router = useRouter()
  const algLabelAllTokens = useAlgLabelAllTokens()

  const { handleGetAlgTokenList, handleClaim } = useAirdropTokenScore()

  const algTokenList = useMemo(() => {
    return Object.values(algLabelAllTokens)
  }, [algLabelAllTokens])

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
                algTokenList.map(algToken => {
                  return (
                    <AlgTokenListItem key={algToken?.address} algToken={algToken} claim={handleClaim} />
                    
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