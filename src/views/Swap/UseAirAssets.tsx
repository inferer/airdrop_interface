import { useAirTokenPercent, useUpdateAirTokenPercent } from "../../state/airdrop/hooks";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const UseAirAssets: React.FC<{
  onChange?: (percent: number) => void
}> = ({
  onChange
}) => {
  const updateAirTokenPercent = useUpdateAirTokenPercent()
  const airPercent = useAirTokenPercent()

  const pointerRef = useRef<any>(null)
  const wrapRef = useRef<any>(null)
  const [wrapInfo, setWrapInfo] = useState({ left: 0, top: 0, width: 0})
  const [focusPointer, setFocusPointer] = useState(false)
  const [showPointer, setShowpointer] = useState(false)
  const [downPageX, setDownPageX] = useState(0)
  const [selectWidth, setSelectWidth] = useState(0)

  const handleMouseMove = useCallback(async (e) => {
    if (focusPointer) {
      let _width = e.pageX - wrapInfo.left
      if (_width < 0) _width = 0
      if (_width > wrapInfo.width - 3) _width = wrapInfo.width
      setSelectWidth(_width)
      updateAirTokenPercent(Math.ceil(_width / wrapInfo.width * 100))
    }
  }, [focusPointer, downPageX, wrapInfo])

  useEffect(() => {
    if (wrapRef.current) {
      const data = wrapRef.current?.getBoundingClientRect()
      setWrapInfo({ left: data.left, top: data.top, width: data.width })
    }
    updateAirTokenPercent(0)
  }, [])

  const pointerLeft = useMemo(() => {
    if (selectWidth > wrapInfo.width - 3) return wrapInfo.width - 3
    return selectWidth
  }, [wrapInfo, selectWidth])

  return (
    <div className="w-full h-[58px] rounded-xl border border-[#F5F5F5] flex items-center px-4">
      <div className=" text-[16px] font-fsemibold text-[rgba(0,0,0,0.40)]">
        Use air assets
      </div>
      <div ref={wrapRef} className=" relative bg-[#F4F6FE] w-[284px] h-[20px] mx-[10px] shrink-0 rounded-[5px] flex items-center justify-between overflow-hidden"
        onMouseEnter={e => {
          e.stopPropagation()
          setShowpointer(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setShowpointer(false)
        }}
        onMouseMove={e => {
          e.stopPropagation()
          handleMouseMove(e)
        }}
        onMouseUp={e => {
          e.stopPropagation()
          setFocusPointer(false)
        }}
      >
        <div className="h-[12px] w-[2px] bg-[#DBF0DE] absolute top-[4px] left-[25%]"></div>
        <div className="h-[12px] w-[2px] bg-[#DBF0DE] absolute top-[4px] left-[50%]"></div>
        <div className="h-[12px] w-[2px] bg-[#DBF0DE] absolute top-[4px] left-[75%]"></div>
        <div className="h-full bg-[#EAF8EC] absolute left-0 top-0" style={{width: selectWidth}}>

        </div>
        {
          showPointer && 
          <div ref={pointerRef} className="w-[3px] h-[20px] bg-[#495BFF] cursor-pointer absolute top-0" style={{ left: pointerLeft }}
            onMouseDown={e => {
              e.stopPropagation()
              setDownPageX(e.pageX)
              setFocusPointer(true)
            }}
            onMouseUp={e => {
              e.stopPropagation()
              setFocusPointer(false)
            }}
          ></div>
        }
        
      </div>
      <div className=" font-fbold text-[16px] text-[#495BFF]">
        { airPercent }%
      </div>
    </div>
  )
}

export default UseAirAssets