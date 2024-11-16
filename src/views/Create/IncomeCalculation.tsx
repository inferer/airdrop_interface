import { useEffect, useRef, useState } from "react"
import LazyImage from "../../components/LazyImage"
import { insertCssLink, insertScript } from "../../utils"



const IncomeCalculation = () => {

  const [expend, setExpend] = useState(true)
  const [svgHtml, setSvgHtml] = useState('')
  const [svgHtml2, setSvgHtml2] = useState('')

  const [texStr, setTexStr] = useState(`CI={\\sum ^{n}_{i=1} {{R}^{i}}\\cdot O=R\\cdot O+{R}^{2}\\cdot O+{R}^{3}\\cdot O+...+{R}^{n-1}\\cdot O+{R}^{n}\\cdot O}`)
  const [texStr2, setTexStr2] = useState(`CI=\\sum ^{n}_{i=1} {{0.75}^{i}}\\cdot 1\\cdot airsocial=(0.75+{0.75}^{2}+{0.75}^{3}+...+{0.75}^{n-1}+{0.75}^{n})\\cdot airsocial=3\\cdot airsocial`)

  const mathjaxContainer = useRef<any>(null)
  const katex = useRef<any>(null)
  useEffect(() => {
    // @ts-ignore
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
      },
      svg: {
        fontCache: 'global'
      }
    };
    // @ts-ignore
    window.WebFontConfig = {
      custom: {
          families: ['KaTeX_AMS', 'KaTeX_Caligraphic:n4,n7', 'KaTeX_Fraktur:n4,n7',
              'KaTeX_Main:n4,n7,i4,i7', 'KaTeX_Math:i4,i7', 'KaTeX_Script',
              'KaTeX_SansSerif:n4,n7,i4', 'KaTeX_Size1', 'KaTeX_Size2', 'KaTeX_Size3',
              'KaTeX_Size4', 'KaTeX_Typewriter'],
      },
    };
    function getOptions() {
      var options = {
        "displayMode": true,
        "leqno": false,
        "fleqn": false,
        "throwOnError": true,
        "errorColor": "#cc0000",
        "strict": "warn",
        "output": "htmlAndMathml",
        "trust": false,
        "macros": {
            "\\f": "#1f(#2)"
        }
      }
      return options;
    }
    insertCssLink('/js/katex/katex.min.css', 'katex-css')
    insertScript('/js/katex/katex.min.js', 'katex-js', () => {
      katex.current = window.katex
      // @ts-ignore
      const _html = katex.current?.renderToString(texStr, getOptions())
      setSvgHtml(_html)
      // @ts-ignore
      const _html2 = katex.current?.renderToString(texStr2, getOptions())
      setSvgHtml2(_html2)
      
    });
  }, [])
  return (
    <div className='w-full h-auto border border-[rgba(85,123,241,0.10) rounded-md mt-[30px]'>
      <div
        onClick={e => {
          e.stopPropagation()
          setExpend(!expend)
        }} 
        className=' cursor-pointer flex items-center justify-between bg-[rgba(85,123,241,0.10)] w-full h-[48px] px-5' style={{borderRadius: '6px 6px 0px 0px'}}>
        <div className=' flex items-center'
          onClick={e => {
            e.stopPropagation()
          }}
        >
          <LazyImage src='/images/airdrop/icon/info.svg' />
          <span className='text-[12px] font-fmedium ml-[6px] cursor-text'>Compound income calculation</span>
        </div>
        <div
          className=' cursor-pointer'
          
        >
          <LazyImage src='/images/airdrop/icon/arrow-down.svg' className={`transition-all ${expend ? ' -rotate-180' : ''}`} />
        </div>
      </div>
        {
        expend && 
        <div className='p-5 text-[12px] font-fnormal'>
          <div>Compound income is calculated exponentially based on 1 Air-Social. As the refer percentage changes, compound benefits would grow massively. Assume the compound income is CI, the refer precentage is R, the offer per unit is O, n is the number of people who refers, then the formula would be such as:</div>
          <div className='mt-[39px] mb-[33px] text-[16px] flex justify-start pl-2'>
            {/* <LazyImage src='/images/airdrop/icon/ci1.png' className='w-[462px]' /> */}
            <div dangerouslySetInnerHTML={{ __html: svgHtml }} />
          </div>
          <div>For example, the refer percentage is 0.75, the offer per unit is 1 x Air-Social token, and we maximize the refer process, then we could have the compound income equal to 3 x Air-Social token.</div>
          <div className='mt-[20px] mb-[32px] text-[16px] flex justify-start pl-2'>
            {/* <LazyImage src='/images/airdrop/icon/ci2.png' className='w-[746px]' /> */}
            <div dangerouslySetInnerHTML={{ __html: svgHtml2 }} />
          </div>
          <div>
          With thid refer design mechanism deployed in contract, there would be always expotential benefits when peple refer further and acquire lots of fun.
          </div>
        </div>
        }
      
    </div>
  )
}

export default IncomeCalculation