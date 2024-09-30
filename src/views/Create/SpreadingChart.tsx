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
  const [borderColor, setBorderColor] = useState('')
  const [bgColor, setBgrColor] = useState('')
  const [currentColor, setCurrentColor] = useState('')
  
  const [colorList, setColorList] = useState([
    [115, 171, 254],
    [82, 254, 223],
    [255, 210, 77],
    [255, 64, 190],
    [253, 16, 41],
  ])

  const drawBg = (diameter = 24) => {
    const rowNums = Math.floor(drawHeight / (diameter + 1)) 
    const columnNums = Math.floor(drawWidth / (diameter + 1)) 

    for(let row = 0; row < rowNums; row++) {
      // const centerX = Math.floor(columnNums / 2) * (diameter + 1) + 2
      const centerX = Math.floor(drawWidth / 2)

      let xL = centerX - (diameter + 1) * 1
      let y = row * (diameter + 1) + 2
      while(xL > -diameter) {
        draw?.circle(diameter).fill('#EFEFEF').move(xL, y)
        xL = xL - (diameter + 1) - 0
      }
      let xR = centerX 
      while (xR < (drawWidth )) {
        draw?.circle(diameter).fill('#EFEFEF').move(xR, y)
        xR = xR + (diameter + 1)  + 0
      }
      // for(let column = 0; column < columnNums; column++) {
      //   let x = column * (diameter + 1) + 2
      //   let y = row * (diameter + 1) + 2
       
      //   draw?.circle(diameter).fill('#EFEFEF').move(x, y)
      // }
      
    }
  }

  const getColor = (color: number[] = [], opacity = 1) => {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`
  }

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
  const [rowCol, setRowCol] = useState({row: 0, col: 0})
  const drawContent = useCallback((_diameter = 24, index = 0, per = 0.75) => {
    const colorPer = 1 - per;
    const diameter = 40 - (per) * 24
    const rowNums = Math.floor(drawHeight / (diameter + 1)) 
    const columnNums = Math.floor(drawWidth / (diameter + 1)) 
    const colorData = getColor2(colorPer)

    setBgrColor(getColor(colorData, 0.06))
    setCurrentColor(getColor(colorData, 1))
    setBorderColor(getColor(colorData, 1))

    // if (Math.abs(rowNums - rowCol.row) < 1 || Math.abs(columnNums - rowCol.col) < 1) {
    //   setRowCol({row: rowNums, col: columnNums})
    //   return
    // }    
    setRowCol({row: rowNums, col: columnNums})
    draw?.clear()
    drawBg(diameter)
    // draw?.clear()
    // 计算中间点的位置
    // const centerX = Math.floor(columnNums / 2) * (diameter + 1) + 2
    const centerX = Math.floor(drawWidth / 2)
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
      let fillColor = 1 - (num * 0.1)
      if (fillColor < 0.4) fillColor = 0.4
      while(xL >= -diameter && num > 0) {
        draw?.circle(diameter - 1).fill(getColor(colorData, fillColor)).move(xL, y)
        xL = xL - (diameter + 1) * 2
        num = num - 1
      }

      // 从中间往右画
      num = row
      let xR = centerX + (diameter + 1) * 1
      while(xR < (drawWidth ) && num > 0) {
        draw?.circle(diameter - 1).fill(getColor(colorData, fillColor)).move(xR, y)
        xR = xR + (diameter + 1) * 2
        num = num - 1
      }
    }
    let fillColor = 0.4
    let xL = centerX - (diameter + 1) * 1
    let y = (row) * (diameter + 1) + 2
    while(xL >= -diameter) {
      draw?.circle(diameter - 1).fill(getColor(colorData, fillColor)).move(xL, y)
      xL = xL - (diameter + 1) * 1
    }
    let xR = centerX
    while(xR < (drawWidth )) {
      draw?.circle(diameter - 1).fill(getColor(colorData, fillColor)).move(xR, y)
      xR = xR + (diameter + 1) * 1
    }
      

  }, [colorList, rowCol])

  useEffect(() => {
    if (!draw) {
      draw = SVG().addTo('#SpreadingChart').size(928, 453)
    }
    // drawBg()
    drawContent(24, 3)

    return () => {
      draw = null
    }
  }, [])

  const [preIndex, setPreIndex] = useState(3)
  const [per, setPer] = useState(0.25)

  return (
    <div className=' flex'>
      <div id='SpreadingChart' className='w-[932px] h-[457px] border-2 border-[#FFD24D] border-solid rounded-[14px] mt-3 shrink-0 overflow-hidden'
        style={{
          borderColor: borderColor,
          backgroundColor: bgColor
        }}
      >
        
      </div>
      
        <SpreadingColor 
          view={!onChange}
          value={currentColor} 
          onChange={(index, per) => {
            setPer(per)
            // if (index === preIndex) return
            setPreIndex(index)
            drawContent(24, index, per)
            onChange && onChange(per)
          }}
        />
        
    </div>
  )
}

export default SpreadingChart