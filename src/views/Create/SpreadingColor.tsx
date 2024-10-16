import LazyImage from "../../components/LazyImage";
import { useAirTokenPercent, useUpdateAirTokenPercent } from "../../state/airdrop/hooks";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

const SpreadingColor = ({
  view,
  value,
  onChange
}: {
  view?: boolean
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
      let per = (_currentTop + 8) / wrapInfo.height
      if (per > 0.745 && per < 0.755) {
        per = 0.75
        _currentTop = 332
      }
      if (per > 0.495 && per < 0.505) {
        per = 0.5
        _currentTop = 218
      }
      if (per > 0.245 && per < 0.255) {
        per = 0.25
        _currentTop = 103
      }
      if (per < 0.02) {
        per = 0
      }
      let colorIndex = 0
      if (per >= 0.25) colorIndex = 1
      if (per >= 0.5) colorIndex = 2
      if (per >= 0.75) colorIndex = 3
      if (per >= 0.96) colorIndex = 4
      // if (moveTimer.current) {
      //   clearTimeout(moveTimer.current)
      // }
      setCurrentTop(_currentTop)
      
      moveTimer.current = setTimeout(() => {
        onChange && onChange(colorIndex, per > 0.96 ? 1 : per)
      }, 10)
      
    }
  }, [focusPointer, downPageY, preTop, currentTop, onChange])

  useEffect(() => {
    if (wrapRef.current) {
      const data = wrapRef.current?.getBoundingClientRect()
      const _initTop = Math.floor(data.height / 4) * 3 - 8
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
    <div className="flex items-center mt-3 pl-[37px] relative w-full"
      onMouseEnter={e => {
        e.stopPropagation()
        setShowpointer(true)
      }}
      onMouseLeave={e => {
        e.stopPropagation()
        if (view) return
        setShowpointer(false)
        setFocusPointer(false)
        setPreTop(currentTop)
      }}
      onMouseMove={e => {
        e.stopPropagation()
        if (view) return
        handleMouseMove(e)
      }}
      onMouseUp={e => {
        e.stopPropagation()
        // setFocusPointer(false)
      }}
      // onMouseOut={e => {
      //   e.stopPropagation()
      //   setFocusPointer(false)
      //   setPreTop(currentTop)
      // }}
    >
      <div ref={wrapRef} className=" relative bg-[#F4F6FE] w-[8px] h-[453px] mx-[10px] shrink-0 rounded-[5px] flex items-center justify-between "
        style={{background: 'linear-gradient(0deg, #73ABFE 0%, #52FEDF 28.7%, #FFD24D 56.05%, #FF40BE 80.66%, #FD1029 99.89%)'}}
        
      >
        <div className='text-[rgba(0,0,0,0.6)] text-[14px] font-dbold h-full absolute top-0 left-[1px] py-[6px]'>
          <div className="w-[6px] h-[2px] bg-white rounded-[100px] absolute left-0 top-[25%]"></div>
          <div className="w-[6px] h-[2px] bg-white rounded-[100px] absolute left-0 top-[50%]"></div>
          <div className="w-[6px] h-[2px] bg-white rounded-[100px] absolute left-0 top-[75%]"></div>
        </div>
        <div ref={pointerRef} className="w-[22px] h-[22px] border-2 border-white border-solid rounded-[18px] cursor-pointer absolute -left-[7px] top-10" 
          style={{ 
            top: pointerTop,
            fill: '#FFD24D',
            strokeWidth: '2px',
            stroke: '#FFF',
            filter: 'drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.05))', 
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
            background: value ?? 'none'
          }}
          onMouseDown={e => {
            e.stopPropagation()
            if (view) return
            setDownPageY(e.pageY)
            setFocusPointer(true)
          }}
          onMouseUp={e => {
            e.stopPropagation()
            if (view) return
            setFocusPointer(false)
            setPreTop(currentTop)
          }}
          
          >
        </div>
          
      </div>
      <div className=' flex flex-col justify-between text-[rgba(0,0,0,0.6)] text-[14px] font-dbold h-full relative'>
        <div className=" absolute left-0 top-0">1.25</div>
        <div className=" absolute left-0 top-[25%] -mt-[8px]">1.00</div>
        <div className=" absolute left-0 top-[50%] -mt-[8px]">0.75</div>
        <div className=" absolute left-0 top-[75%] -mt-[9px]">0.50</div>
        <div className=" absolute left-0 top-[100%] -mt-[20px]">0.25</div>
      </div>
    </div>
  )
}

export default forwardRef(SpreadingColor)