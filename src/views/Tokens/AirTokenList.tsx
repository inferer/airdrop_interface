
import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "./Table";
import { useUserAlgAirdropList } from "../../state/airdrop/hooks";
import { useRouter } from "next/router";
import { useAirdropTokenScore } from "../../hooks/useAirdropTokenScore";
import { IAlgAirdrop } from "../../state/airdrop/actions";
import { useAirLabelAllTokens, useCurrency } from "../../hooks/Tokens";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { useActiveWeb3React } from "../../hooks";
import { Currency } from "@uniswap/sdk";

const AlgTokenListItem: React.FC<{
  airToken: Currency
}> = ({
  airToken,
}) => {
  const { account } = useActiveWeb3React()
  // const algTokenCurrency = useCurrency(algAirdrop.token.address)
  // const algTokenCurrencyAmount = useCurrencyBalance(account ?? undefined, algTokenCurrency ?? undefined)
  const balance = useCurrencyBalance(account ?? undefined, airToken)
  return (
    <TableRow key={airToken.symbol} 
      onClick={() => {
        
      }}
    >
      <>
        <TableCell className="flex-1 w-[120px] ">
          <div className="h-[35px] flex items-center justify-center font-fsemibold text-[16px]">
            { airToken?.symbol }
          </div>
        </TableCell>
        <TableCell className="w-[130px] ">
          <span className="font-fmedium">{balance?.toSignificant(6)}</span> 
        </TableCell>
        <TableCell className="w-[150px]">
          <div className="flex items-center">
            <span>{1000}</span>
            
          </div>
          
        </TableCell>
        
      </>
    </TableRow>
  )
}


const AirTokenList: React.FC<{

}> = () => {

  const router = useRouter()
  const airLabelAllTokens = useAirLabelAllTokens()
  const userAlgAirdropList = useUserAlgAirdropList()

  const { handleGetAlgTokenList, handleClaim } = useAirdropTokenScore()

  const airTokenList = useMemo(() => {
    return Object.values(airLabelAllTokens)
  }, [airLabelAllTokens])

  useEffect(() => {

    handleGetAlgTokenList()

  }, [router])


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
                <span>Details</span> 
              </TableHeadCell>
            </>
          </TableHead>
          <TableBody>
            <>
              {
                airTokenList.map(airToken => {
                  return (
                    <AlgTokenListItem key={airToken?.address} airToken={airToken} />
                    
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

export default AirTokenList