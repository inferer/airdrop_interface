import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import LazyImage, { LazyImage2 } from "../LazyImage"
import { Loading, Loading2 } from "../Loader"
import { Currency } from "@uniswap/sdk"

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const Withdraw = ({
  token,
  onClick,
  currentTokenAddress,
  balance,
  isProjectMode,
  isDeposit
}: {
  token: Currency,
  onClick?: (value: string, token: Currency) => void,
  currentTokenAddress?: string
  balance: string
  isProjectMode?: boolean
  isDeposit?: boolean
}) => {
  const [inputValue, setInputValue] = useState('0')
  const [inputFocus, setInputFocus] = useState(false)

  const [editable, setEditable] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setInputValue(balance)
  }, [balance])

  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '') {
      setInputValue(nextUserInput)
      return
    }
    if (!inputRegex.test(escapeRegExp(nextUserInput))) return
    setInputValue(nextUserInput)
  }

  const handleInputClick = useCallback((e) => {
    
    if (editable) return
    setEditable(true)
    if (inputRef.current) {
      // e.target.select()
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      
    }
    
  }, [editable])
  const handleFocus = useCallback(() => {
    setInputFocus(true)
  }, [])
  const handleBlur = useCallback(() => {
    setInputFocus(false)
  }, [])
  const inputWrapWidth = useMemo(() => {
    const _width = inputValue.length * 20
    return _width > 140 ? 140 : _width > 52 ? _width : 52
  }, [inputValue])

  const handleWithdraw = useCallback(() => {
    if (currentTokenAddress || isActionDisable) return
    onClick && onClick(inputValue, token)
  }, [inputValue, token, currentTokenAddress])

  const isActionDisable = useMemo(()=>{
    let value = parseInt(inputValue);
    return !value
  },[inputValue])

  return (
    <div className=" flex items-center">
      <div 
        style={{width: inputWrapWidth}}
        className={`flex items-center px-2 h-[26px] max-w-full hover:bg-[rgba(107,190,225,0.10)] rounded-sm cursor-pointer mr-2 ${ inputFocus ? 'bg-[rgba(107,190,225,0.10)]' : ''}`}
      >
        <div className="text-[18px] font-fmedium"
        >
          <input 
            ref={inputRef}
            type="text" aria-autocomplete="none" autoComplete="off"
            value={inputValue}
            onChange={e => {
              enforcer(e.target.value.replace(/,/g, '.'))
              // setInputValue(e.target.value)
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={` 
              text-right text-[18px] h-[22px] font-fmedium w-full outline-none 
              ${isProjectMode ? 'text-[#8F8EFF]' : 'text-[#90B696]'}
              ${ inputFocus ? isProjectMode ? 'bg-[rgba(143,142,255,0.08)]' : 'bg-[rgba(161,206,168,0.3)]' : 'bg-[rgba(0,0,0,0)]'}
            `}
          />
        </div>
        {/* <div className="pl-1 cursor-pointer shrink-0">
          <LazyImage2 src={isProjectMode ? "/images/airdrop/edit2.svg" : "/images/airdrop/edit.svg"} />
        </div> */}
      </div>
      
      <div className="  shrink-0 w-[15px]">
        {
          // @ts-ignore
          currentTokenAddress === token.address ? 
            <Loading2 /> :
            <div className={[isActionDisable ? 'disabled' : 'cursor-pointer'].join(' ')}
              onClick={e => {
                e.stopPropagation()
                handleWithdraw()
              }}
            >
              <LazyImage2 src={
                isDeposit ? "/images/airdrop/deposit2.svg" : 
                isProjectMode ? "/images/airdrop/card2.svg" : 
                "/images/airdrop/card.svg"
              }  />
            </div>
        }
        
        
      </div>
    </div>
  )
}

export default Withdraw