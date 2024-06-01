import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import LazyImage, { LazyImage2 } from "../../components/LazyImage";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useIsRoleProjectMode } from "../../state/user/hooks";


export const SelectMenu: React.FC<{
  
  onChange?: (data: any) => void
}> = ({
  onChange
}) => {
  const router = useRouter()
  const isProjectMode = useIsRoleProjectMode()
  const [showOptions, setShowOptions] = useState(false)
  const [current, setCurrent] = useState<any>({})
  const wrapRef = useRef<HTMLDivElement>(null)
  const node = useRef<HTMLDivElement>(null)

  const handleClick = useCallback(async (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (isProjectMode) {
      if (wrapRef.current) {
        const rect = wrapRef.current.getBoundingClientRect()
        if (node.current) {
          node.current.style.left = rect.left + 16 + 'px'
          node.current.style.right = rect.right + 'px'
          node.current.style.top = rect.y + rect.height + 6 + 'px'
        }
      }
      setShowOptions(!showOptions)
    } else {
      router.push('/user/campaign')
    }
    
  }, [showOptions, isProjectMode])

  const handleClickItem = useCallback(async (data) => {
    setCurrent(data)
    setShowOptions(false)
    onChange && onChange(data)
  }, [])

  useOnClickOutside(node, showOptions ? () => setShowOptions(false) : undefined)

  return (
    <div ref={wrapRef} className="flex items-center justify-end min-w-[120px] relative"
    >
      <div className="flex justify-between items-center py-3 px-4 h-[48px] text-[16px] rounded-[8px] cursor-pointer group font-fsemibold text-[rgba(50,49,48,0.40)] hover:text-[#323130]"
        onClick={handleClick}
        
        style={{color: showOptions || (router.query?.action && router.query?.action[0] === 'campaign' ) ? '#323130' : ''}}
      >
        <div className="flex items-center mr-1">
          <div className={`
            rounded-[4px] 
            ${showOptions ? '' : ''}
          `}>
            Campaign
          </div>
        </div>
        
        {/* <LazyImage src="/images/airdrop/arrow-down2.svg" className={` ${showOptions ? 'rotate-180' : 'rotate-0' }  `} /> */}
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
        style={{ height: showOptions ? 'auto' : 0, padding: showOptions ? '16px' : 0, background: 'linear-gradient(135deg, rgba(63, 60, 255, 0.04) 0%, rgba(107, 190, 225, 0.04) 100%)'}}
        className={`options fixed z-50 bg-white rounded-lg transition-all w-[250px]`}>
          <div className="overflow-auto scrollbar-container h-full group"
            style={{ height: showOptions ? 'auto' : 0 }}
          >
            <div
              onClick={e => {
                e.stopPropagation()
                // handleClickItem(item)
                setShowOptions(false)
                router.push('/project/campaign/create')
              }}
              className="flex items-center text-[16px] font-fbold h-[36px] cursor-pointer">
                <div className="rounded-[4px] mr-4 w-[36px] h-[36px] shrink-0 ">
                  <LazyImage2 className="w-[36px] h-[36px]" src={'/images/campaign/create.svg'}/>
                </div>
                
                Create the Campaign
              </div>
          </div>
          {
            showOptions &&
            <div className="my-2">
              <div
                onClick={e => {
                  
                }}
                className="flex items-center ">
                  <div className="rounded-[4px] mr-4 w-[36px] h-[1px] shrink-0 ">
                  </div>
                  <div className="h-[1px] bg-[rgba(63,60,255,0.10)] w-full">

                  </div>
                </div>
            </div>
          }
          
          <div className="overflow-auto scrollbar-container h-full group"
            style={{ height: showOptions ? 'auto' : 0 }}
          >
            <div
              onClick={e => {
                e.stopPropagation()
                setShowOptions(false)
                router.push('/project/campaign')
              }}
              className="flex items-center text-[16px] font-fbold h-[36px] cursor-pointer">
                <div className="rounded-[4px] mr-4 w-[36px] h-[36px] shrink-0 ">
                  <LazyImage2 className="w-[36px] h-[36px]" src={'/images/campaign/view.svg'}/>
                </div>
                
                Campaigns
              </div>
          </div>
      </div>
    </div>
  )
}

export default SelectMenu

