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

  const pointerRef = useRef<any>(null)
  const wrapRef = useRef<any>(null)
  const [wrapInfo, setWrapInfo] = useState({ left: 0, top: 0, height: 0})
  const [currentTop, setCurrentTop] = useState(0)

  useEffect(() => {
    if (wrapRef.current) {
      const data = wrapRef.current?.getBoundingClientRect()
      const _initTop = Math.floor(data.height / 4) * 3 - 24
      setCurrentTop(_initTop)
      setWrapInfo({ left: data.left, top: data.top, height: data.height })
    }
    updateAirTokenPercent(0)
  }, [])

  const pointerTop = useMemo(() => {
    return currentTop
  }, [wrapInfo, currentTop])

  const getColor = (color: number[] = [], opacity = 1) => {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
  }
  const [colorList, setColorList] = useState([
    [115, 171, 254],
    [82, 254, 223],
    [255, 210, 77],
    [255, 64, 190],
    [253, 16, 41],
  ])
  const getColor2 = (colorPer: number) => {
    let color1 = colorList[0]
    let color2 = colorList[1]
    let colorPer2 = 0
    if (colorPer < 0.25) {
      color1 = colorList[0]
      color2 = colorList[1]
      colorPer2 = colorPer
    } else if (colorPer < 0.5 && colorPer >= 0.25) {
      color1 = colorList[1]
      color2 = colorList[2]
      colorPer2 = colorPer - 0.25
    } else if (colorPer < 0.75 && colorPer >= 0.5) {
      color1 = colorList[2]
      color2 = colorList[3]
      colorPer2 = colorPer - 0.5
    } else {
      color1 = colorList[3]
      color2 = colorList[4]
      colorPer2 = colorPer - 0.75
    } 

    const colorNew = color1.map((cl, index) => {
      return cl + Math.ceil((color2[index] - cl) * (colorPer2 / 0.25))
    })
    return colorNew
  }

  const [currentColor, setCurrentColor] = useState('')
  useEffect(() => {
    const colorPer = 1 - Number(value);
    const colorData = getColor2(colorPer)

    setCurrentColor(getColor(colorData, 1))
  }, [value])

  return (
    <div className="flex items-center mt-3 pl-[49px] relative w-full"
    >
      <div ref={wrapRef} className=" relative bg-[#F4F6FE] w-[8px] h-[453px] mx-[10px] shrink-0 rounded-[5px] flex items-center justify-between "
        style={{background: 'linear-gradient(0deg, #73ABFE 0%, #52FEDF 28.7%, #FFD24D 56.05%, #FF40BE 80.66%, #FD1029 99.89%)'}}
        
      >
        
        <div ref={pointerRef} className="w-[14px] h-[14px] absolute -left-[7px] top-10" 
          style={{ 
            top: pointerTop
          }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="52" viewBox="0 0 51 52" fill="none">
              <g filter="url(#filter0_d_2478_210)">
                <path d="M30.2274 17.2762C30.2274 16.5064 29.3941 16.0253 28.7274 16.4102L21.0947 20.8169C20.428 21.2018 20.428 22.1641 21.0947 22.549L28.7274 26.9557C29.3941 27.3406 30.2274 26.8595 30.2274 26.0897L30.2274 17.2762Z" fill={currentColor}/>
              </g>
              <defs>
                <filter id="filter0_d_2478_210" x="0.594727" y="0.274902" width="49.6328" height="50.8164" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="4"/>
                  <feGaussianBlur stdDeviation="10"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2478_210"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2478_210" result="shape"/>
                </filter>
              </defs>
            </svg>
        </div>
          
      </div>
      <div className=' flex flex-col justify-between text-[rgba(0,0,0,0.6)] text-[14px] font-dbold h-[463px] ml-3'>
        <div>1.25</div>
        <div>1.00</div>
        <div>0.75</div>
        <div>0.50</div>
        <div>0.25</div>
      </div>
    </div>
  )
}

export default forwardRef(SpreadingColor)