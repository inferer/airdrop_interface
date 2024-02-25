import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import LazyImage, { LazyImage2 } from "../../components/LazyImage";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";


const Select: React.FC<{
  defaultValue: {[key: string]: string},
  options: {[key: string]: string}[],
  onChange?: (data: {[key: string]: string}) => void
}> = ({
  defaultValue,
  options,
  onChange
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const [current, setCurrent] = useState<{[key: string]: string}>({})
  const handleClick = useCallback(async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setShowOptions(!showOptions)
  }, [showOptions])

  const handleClickItem = useCallback(async (data) => {
    setCurrent(data)
    setShowOptions(false)
    onChange && onChange(data)
  }, [])

  const optionsHeight = useMemo(() => {
    const height = options.length * 41
    return height
  }, [options])
  const node = useRef<HTMLDivElement>(null)
  useOnClickOutside(node, showOptions ? () => setShowOptions(false) : undefined)

  return (
    <div className="flex items-center justify-between bg-[rgba(85,123,241,0.02)] rounded-[8px] cursor-pointer min-w-[120px] relative">
      <div className="flex justify-between items-center w-full py-3 px-4 "
        onClick={handleClick}
      >
        <span className="mr-5">{current.label || defaultValue.label}</span>
        <LazyImage src="/images/airdrop/arrow-down.svg" className={` ${showOptions ? 'rotate-180' : 'rotate-0' }  `} />
      </div>
      {
        showOptions && 
        <div className=" absolute left-0 top-0 h-full w-full z-50 opacity-0"
          onClick={e => {
            e.stopPropagation()
            setShowOptions(false)
          }}
        ></div>
      }
      
      <div 
        ref={node}
        style={{ height: showOptions ? optionsHeight : 0 }}
        className={`options absolute left-0 right-0 top-[110%] z-50 bg-white rounded-lg overflow-hidden transition-all `}>
        {
          options.map(item => {
            return <div
              key={item.value} 
              onClick={e => {
                e.stopPropagation()
                handleClickItem(item)
              }}
              className="flex items-center text-[14px] font-fmedium h-[41px] px-4 cursor-pointer bg-[rgba(85,123,241,0.02)] hover:bg-[rgba(85,123,241,0.08)]">{item.label}</div>
          })
        }
        
      </div>
    </div>
  )
}

export const SelectChain: React.FC<{
  defaultValue: {[key: string]: string},
  options: {[key: string]: string}[],
  onChange?: (data: {[key: string]: string}) => void
}> = ({
  defaultValue,
  options,
  onChange
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const [current, setCurrent] = useState<{[key: string]: string}>({})
  const handleClick = useCallback(async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setShowOptions(!showOptions)
  }, [showOptions])

  const handleClickItem = useCallback(async (data) => {
    setCurrent(data)
    setShowOptions(false)
    onChange && onChange(data)
  }, [])

  const optionsHeight = useMemo(() => {
    const height = options.length * 41
    return height
  }, [options])
  const node = useRef<HTMLDivElement>(null)
  useOnClickOutside(node, showOptions ? () => setShowOptions(false) : undefined)
  const label = useMemo(() => {
    return current.label || defaultValue.label || 'Select'
  }, [defaultValue, current])
  return (
    <div className="flex items-center justify-between bg-[rgba(85,123,241,0.02)] rounded-[8px] cursor-pointer min-w-[161px] relative">
      <div className="flex justify-between items-center w-full py-3 px-4  h-[44px] text-[14px]"
        onClick={handleClick}
      >
        <div className="flex items-center">
          <LazyImage2 src={current.icon || '/images/airdrop/chain_local.svg'} />
          <span className={`mr-5 ml-2 ${label === 'Select' ? 'text-[rgba(0,0,0,0.40)]' : ''}`}>{label}</span>
        </div>
        
        <LazyImage src="/images/airdrop/arrow-down.svg" className={` ${showOptions ? 'rotate-180' : 'rotate-0' }  `} />
      </div>
      {
        showOptions && 
        <div className=" absolute left-0 top-0 h-full w-full z-50 opacity-0"
          onClick={e => {
            e.stopPropagation()
            setShowOptions(false)
          }}
        ></div>
      }
      
      <div 
        ref={node}
        style={{ height: showOptions ? optionsHeight : 0 }}
        className={`options absolute left-0 right-0 top-[110%] z-50 bg-white rounded-lg overflow-hidden transition-all `}>
        {
          options.map(item => {
            return <div
              key={item.value} 
              onClick={e => {
                e.stopPropagation()
                handleClickItem(item)
              }}
              className="flex items-center text-[14px] font-fmedium h-[41px] px-4 cursor-pointer bg-[rgba(85,123,241,0.02)] hover:bg-[rgba(85,123,241,0.08)]">{item.label}</div>
          })
        }
        
      </div>
    </div>
  )
}

export default Select