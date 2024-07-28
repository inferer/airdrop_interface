import { SVG, Svg } from '@svgdotjs/svg.js'

import SpreadingColor from "./SpreadingColor"
import { useCallback, useEffect, useRef, useState } from 'react'


let draw: Svg | null = null

const SpreadingChart = () => {
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

  const drawContent = useCallback((diameter = 24, index = 0) => {
    draw?.clear()
    drawBg()

    const rowNums = Math.floor(drawHeight / (diameter + 1)) 
    const columnNums = Math.floor(drawWidth / (diameter + 1)) 
    const colorData = colorList[index]
    
    // draw?.clear()
    // 计算中间点的位置
    const centerX = Math.floor(columnNums / 2) * (diameter + 1) + 2
    const centerY = 2
    draw?.circle(diameter - 1).fill('#ffffff').stroke({ width: 1, color: getColor(colorData, 1) }).move(centerX, centerY)
    const _subX = (diameter - 1 - 10) / 2
    draw?.circle(10).fill(getColor(colorData, 1)).move(centerX + _subX, centerY + _subX)

    for(let row = 1; row < rowNums; row++) {
      if (row > 8) break;
      // 从中间往左画
      let xL = centerX - (diameter + 1) * 1
      let y = row * (diameter + 1) + 2
      let num = row
      let fillColor = 1 - row / 10
      if (fillColor < 0.4) fillColor = 0.4
      while(xL >= 2 && num > 0) {
        draw?.circle(diameter - 1).fill(getColor(colorData, fillColor)).move(xL, y)
        xL = xL - (diameter + 1) * 2
        num = num - 1
      }

      // 从中间往右画
      num = row
      fillColor = 1 - row / 10
      if (fillColor < 0.4) fillColor = 0.4
      let xR = centerX + (diameter + 1) * 1
      while(xR < (drawWidth - diameter ) && num > 0) {
        draw?.circle(diameter - 1).fill(getColor(colorData, fillColor)).move(xR, y)
        xR = xR + (diameter + 1) * 2
        num = num - 1
      }

    }
    


  }, [colorList])

  useEffect(() => {
    if (!draw) {
      draw = SVG().addTo('#SpreadingChart').size(928, 453)
    }
    drawBg()
    drawContent()
    
  }, [])

  const [preIndex, setPreIndex] = useState(0)

  return (
    <div className=' flex'>
      <div id='SpreadingChart' className='w-[932px] h-[457px] border-2 border-[#FFD24D] border-solid rounded-[14px] mt-3 shrink-0'>
        
      </div>
      <div className=' mt-3 ml-[55px]'
        
      >
        <SpreadingColor value={''} 
          onChange={index => {
            if (index === preIndex) return
            setPreIndex(index)
            drawContent(24, index)
          }}
        />
      </div>
    </div>
  )
}

export default SpreadingChart