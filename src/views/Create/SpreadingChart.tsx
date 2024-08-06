import { SVG, Svg } from '@svgdotjs/svg.js'

import SpreadingColor from "./SpreadingColor"
import { useCallback, useEffect, useRef, useState } from 'react'


let draw: Svg | null = null

const SpreadingChart = ({
  onChange
}: {
  onChange?: (per: number) => void
}) => {
  const [drawWidth, setDrawWidth] = useState(928)
  const [drawHeight, setDrawHeight] = useState(453)
  
  const [colorList, setColorList] = useState([
    [253, 16, 41],
    [255, 64, 190],
    [255, 210, 77],
    [82, 254, 223],
    [115, 171, 254],
  ])

  const drawBg = (diameter = 24) => {
    const rowNums = Math.floor(drawHeight / (diameter + 1)) 
    const columnNums = Math.floor(drawWidth / (diameter + 1)) 
    for(let row = 0; row < rowNums; row++) {
      for(let column = 0; column < columnNums; column++) {
        let x = column * (diameter + 1) + 2
        let y = row * (diameter + 1) + 2
       
        draw?.circle(diameter).fill('#EFEFEF').move(x, y)
      }
    }
  }

  const getColor = (color: number[] = [], opacity = 1) => {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
  }

  const drawContent = useCallback((_diameter = 24, index = 0, per = 0.5) => {
    const diameter = 40 - (per) * 24
    draw?.clear()
    drawBg(diameter)
    const rowNums = Math.floor(drawHeight / (diameter + 1)) 
    const columnNums = Math.floor(drawWidth / (diameter + 1)) 
    const colorData = colorList[index]
    const opacity = 1 - (per - index * 0.25) / 0.25

    let fillColor = opacity
    if (fillColor < 0.4) fillColor = 0.4
    // draw?.clear()
    // 计算中间点的位置
    const centerX = Math.floor(columnNums / 2) * (diameter + 1) + 2
    const centerY = 2
    draw?.circle(diameter - 1).fill('#ffffff').stroke({ width: 1, color: getColor(colorData, 1) }).move(centerX, centerY)
    const _subX = (diameter - 1 - 10) / 2
    draw?.circle(10).fill(getColor(colorData, 1)).move(centerX + _subX, centerY + _subX)

    let row = 1;
    for( ;row < rowNums; row++) {
      if (row > rowNums / 2) break;
      // 从中间往左画
      let xL = centerX - (diameter + 1) * 1
      let y = row * (diameter + 1) + 2
      let num = row
      while(xL >= 2 && num > 0) {
        draw?.circle(diameter - 1).fill(getColor(colorData, fillColor)).move(xL, y)
        xL = xL - (diameter + 1) * 2
        num = num - 1
      }

      // 从中间往右画
      num = row
      let xR = centerX + (diameter + 1) * 1
      while(xR < (drawWidth - diameter ) && num > 0) {
        draw?.circle(diameter - 1).fill(getColor(colorData, fillColor)).move(xR, y)
        xR = xR + (diameter + 1) * 2
        num = num - 1
      }
    }

    for(let column = 0; column < columnNums; column++) {
      let x = column * (diameter + 1) + 2
      let y = row * (diameter + 1) + 2
      
      draw?.circle(diameter).fill(getColor(colorData, fillColor)).move(x, y)
    }

  }, [colorList])

  useEffect(() => {
    if (!draw) {
      draw = SVG().addTo('#SpreadingChart').size(928, 453)
    }
    // drawBg()
    drawContent(24, 3)
    
  }, [])

  const [preIndex, setPreIndex] = useState(3)
  const [per, setPer] = useState(0.5)
  return (
    <div className=' flex'>
      <div id='SpreadingChart' className='w-[932px] h-[457px] border-2 border-[#FFD24D] border-solid rounded-[14px] mt-3 shrink-0'>
        
      </div>
      <div className=' mt-3 ml-[37px] relative flex'
        
      >
        <SpreadingColor value={''} 
          onChange={(index, per) => {
            setPer(per)
            // if (index === preIndex) return
            setPreIndex(index)
            drawContent(24, index, per)
            onChange && onChange(per)
          }}
        />
        <div className=' flex flex-col justify-between text-[rgba(0,0,0,0.6)] text-[14px] font-dbold'>
          <div>1.25</div>
          <div>1.00</div>
          <div>0.75</div>
          <div>0.50</div>
          <div>0.25</div>
        </div>
      </div>
    </div>
  )
}

export default SpreadingChart