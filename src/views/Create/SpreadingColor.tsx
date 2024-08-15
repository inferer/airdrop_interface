import LazyImage from "../../components/LazyImage";
import { useAirTokenPercent, useUpdateAirTokenPercent } from "../../state/airdrop/hooks";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

const SpreadingColor = ({
  value,
  onChange
}: {
  value: string
  onChange?: (colorIndex: number, per: number) => void
}, ref: React.Ref<unknown> | undefined) => {
  const updateAirTokenPercent = useUpdateAirTokenPercent()
  const airPercent = useAirTokenPercent()

  const pointerRef = useRef<any>(null)
  const wrapRef = useRef<any>(null)
  const [wrapInfo, setWrapInfo] = useState({ left: 0, top: 0, height: 0})
  const [focusPointer, setFocusPointer] = useState(false)
  const [showPointer, setShowpointer] = useState(false)
  const [downPageY, setDownPageY] = useState(0)
  const [currentTop, setCurrentTop] = useState(0)
  const [preTop, setPreTop] = useState(0)

  const moveTimer = useRef<any>(null)
  const handleMouseMove = useCallback(async (e) => {
    if (focusPointer) {
      let _top = e.pageY - downPageY
      let _currentTop = _top + preTop
      if (_currentTop > wrapInfo.height - 15) {
        _currentTop = wrapInfo.height - 15
      }
      if (_currentTop <= 0) {
        _currentTop = 0
      }
      setCurrentTop(_currentTop)
      const per = _currentTop / wrapInfo.height
      let colorIndex = 0
      if (per >= 0.25) colorIndex = 1
      if (per >= 0.5) colorIndex = 2
      if (per >= 0.75) colorIndex = 3
      if (per >= 0.96) colorIndex = 4
      // if (moveTimer.current) {
      //   clearTimeout(moveTimer.current)
      // }
      moveTimer.current = setTimeout(() => {
        onChange && onChange(colorIndex, per > 0.96 ? 1 : per)
      }, 200)
      
    }
  }, [focusPointer, downPageY, preTop, currentTop, onChange])

  useEffect(() => {
    if (wrapRef.current) {
      const data = wrapRef.current?.getBoundingClientRect()
      const _initTop = Math.floor(data.height / 4) * 3 - 12
      setCurrentTop(_initTop)
      setPreTop(_initTop)
      setWrapInfo({ left: data.left, top: data.top, height: data.height })
    }
    updateAirTokenPercent(0)
  }, [])

  const pointerTop = useMemo(() => {
    // if (selectWidth > wrapInfo.height - 3) return wrapInfo.height - 3
    return currentTop
  }, [wrapInfo, currentTop])

  return (
    <div className="flex items-center pl-4">
      <div ref={wrapRef} className=" relative bg-[#F4F6FE] w-[8px] h-[453px] mx-[10px] shrink-0 rounded-[5px] flex items-center justify-between overflow-hidden"
        style={{background: 'linear-gradient(0deg, #73ABFE 0%, #52FEDF 28.7%, #FFD24D 56.05%, #FF40BE 80.66%, #FD1029 99.89%)'}}
        onMouseEnter={e => {
          e.stopPropagation()
          setShowpointer(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setShowpointer(false)
          setFocusPointer(false)
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
        <div ref={pointerRef} className="w-[16px] h-[16px] border-2 border-white border-solid rounded-[18px] cursor-pointer absolute -left-[4px] top-10" 
          style={{ top: pointerTop }}
          onMouseDown={e => {
            e.stopPropagation()
            setDownPageY(e.pageY)
            setFocusPointer(true)
          }}
          onMouseUp={e => {
            e.stopPropagation()
            setFocusPointer(false)
            setPreTop(currentTop)
          }}
          onMouseOut={e => {
            e.stopPropagation()
            setFocusPointer(false)
            setPreTop(currentTop)
          }}
          >
        </div>
        
      </div>
    </div>
  )
}

export default forwardRef(SpreadingColor)