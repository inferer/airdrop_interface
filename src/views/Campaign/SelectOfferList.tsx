import { Currency, ETHER, Token } from "@uniswap/sdk";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TokenInfo } from "./styleds";
import CurrencyLogo from "../../components/CurrencyLogo";
import LazyImage from "../../components/LazyImage";
import { useUSDTAllTokens } from "../../hooks/Tokens";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { useActiveWeb3React } from "../../hooks";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const SelectOfferList = ({ 
  onChange
}: {
  onChange?: (currency: Currency) => void
}) => {
  const { account } = useActiveWeb3React()
  const tokens = useUSDTAllTokens()
  const ETHERToken = ETHER as Token
  const tokensList = useMemo(() => [ETHERToken, ...Object.values(tokens)], [tokens])

  const [lockedCurrency, setlockedCurrency] = useState<Token>(ETHERToken)
  const [showOptions, setShowOptions] = useState(false)
  const [current, setCurrent] = useState<any>({})
  const wrapRef = useRef<HTMLDivElement>(null)
  const node = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(async (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect()
      if (node.current) {
        node.current.style.left = 0 + 'px'
        node.current.style.right = 0 + 'px'
        node.current.style.top = rect.height + 'px'
        node.current.style.width = rect.width + 'px'
      }
    }
    setShowOptions(!showOptions)
  }, [showOptions])

  const handleClickItem = useCallback(async (data) => {
    
    setCurrent(data)
    setlockedCurrency(data)
    setShowOptions(false)
    setTimeout(() => {
      if (wrapRef.current) {
        const rect = wrapRef.current.getBoundingClientRect()
        if (node.current) {
          node.current.style.left = 0 + 'px'
          node.current.style.right = 0 + 'px'
          node.current.style.top = rect.height + 6 + 'px'
          node.current.style.width = rect.width + 'px'
        }
      }
    }, 10)
    
    onChange && onChange(data)
  }, [])

  useEffect(() => {
    onChange && onChange(ETHER)
  }, [onChange])
  
  useOnClickOutside(node, showOptions ? () => setShowOptions(false) : undefined)

  return (
    <div ref={wrapRef} className="relative min-w-[150px]" >
      {
        lockedCurrency ? 
          <TokenInfo className='flex items-center justify-between shrink-0 min-w-[146px] cursor-pointer'
            onClick={handleClick}
          >
            <div className='flex items-center '>
              <CurrencyLogo type='payInputCreate' currency={lockedCurrency || undefined} size={'24px'} />
              <div className='text-[20px] font-fsemibold ml-2'>{lockedCurrency?.symbol}</div>
            </div>
            
            <LazyImage src='/images/campaign/down.svg' className={`ml-2 ${showOptions ? 'rotate-180' : 'rotate-0' } `} />
          </TokenInfo> :
          <div
            className=' cursor-pointer text-[20px] font-fsemibold px-3 flex items-center h-[36px] bg-[rgba(85,123,241,0.06)] rounded-[100px]'
            onClick={handleClick}
          >SelectToken
            <LazyImage src='/images/campaign/down.svg' className={`ml-2 ${showOptions ? 'rotate-180' : 'rotate-0' } `} />
          </div>
      }
      <div 
        ref={node}
        style={{ height: showOptions ? 'auto' : 0, padding: showOptions ? '4px 0 0 0 ' : 0 }}
        className={`options absolute z-50 bg-white rounded-lg overflow-hidden transition-all w-[160px]`}>
          <div className="overflow-auto scrollbar-container h-full group"
            style={{ height: showOptions ? 'auto' : 0 }}
          >
            {
              tokensList.map(item => {
                return <div
                  key={item.symbol} 
                  onClick={e => {
                    e.stopPropagation()
                    handleClickItem(item)
                  }}
                  className="flex items-center text-[14px] font-fmedium h-[44px] px-4 cursor-pointer bg-[rgba(85,123,241,0.02)] hover:bg-[rgba(85,123,241,0.08)]">
                    <CurrencyLogo type='payInputCreate' currency={item || undefined} size={'24px'} />
                    <span className="ml-2">{item.symbol}</span>
                    
                  </div>
              })
            }
          </div>
      </div>
    </div>
  )
}

export default SelectOfferList