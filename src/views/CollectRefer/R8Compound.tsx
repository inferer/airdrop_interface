import { shortenAddress } from "../../utils"
import LazyImage from "../../components/LazyImage"
import SpreadingColor from "./SpreadingColor"
import { useReferNode0 } from "../../state/airdrop/hooks"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { useActiveWeb3React } from "../../hooks"

const Box = ({
  children
}: {
  children: React.ReactChild
}) => {
  return (
    <div className="bg-[rgba(85,123,241,0.04)] border border-solid border-[rgba(85,123,241,0.30)] rounded-[10px] h-[99px] mb-4 flex flex-col justify-center">
      {children}
    </div>
  )
}

const R8Compound = () => {
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const pNode = useReferNode0(router.query.inviter as string)
  const pId = useMemo(() => {
    return pNode ? Number(pNode.id) + 1 : 0
  }, [pNode])
  return (
    <div className=" flex">
      <div>
        <div className=' flex justify-center text-[14px] font-fnormal'>Spreading chart</div>
        <div className="bg-[rgba(85,123,241,0.05)] border border-solid border-[rgba(85,123,241,0.50)] w-[965px] h-[533px] rounded-[14px] mt-3 py-6 px-9 pr-[16px] flex justify-between ">
          <div className="w-[453px]">
            <div className="flex justify-center">
              <div className=" relative">
                <div className="w-[75px] h-[75px] rounded-[12px] flex justify-center items-center text-[40px] font-dbold text-[#6EB2E4]" style={{background: 'linear-gradient(0deg, #EAF6FF 0%, #EAF6FF 100%), #FFF'}}>
                  R{pId}
                </div>
                <div className=" absolute bottom-0 left-0 ml-[100px] flex items-center w-[200px]">
                  <LazyImage src="/images/airdrop-refer/user.svg" className="w-3 h-3" />
                  <div className="w-[1px] h-[12px] bg-[rgba(85,123,241,0.12)] mx-[6px]"></div>
                  <div className="text-[#3F4664] text-[12px] font-dnormal">{ shortenAddress(account ?? '') }</div>
                </div>
              </div>
            </div>
            <div className="mt-10 text-[rgba(0,0,0,0.40)] text-[12px] font-dnormal mb-3">
              Potential compound income would evolve like below:
            </div>
            <Box>
              <>
              <div className="flex items-center">
                <div className="w-[200px] shrink-0 pl-5 flex items-center">
                  <span className=" text-[10px] font-dmedium text-[#FFD879]">Compound income</span>
                </div>
                <div className=" flex items-center" >
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold ">
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFD879]">
                    <div className=" font-dnormal bg-[rgba(255,249,234,1)] rounded-[4px] inline-flex w-5 h-[13px] justify-center items-center text-[10px] text-[#FFB224]">
                      new
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-[200px] shrink-0 pl-5 flex items-center">
                  <span className=" text-[20px] font-dmedium text-[#FFD879]">+</span>
                  <span className=" text-[30px] font-dbold text-[#FFD879] ml-[6px] mr-1">0.5</span>
                  <LazyImage src="/images/airdrop-refer/air-token.svg" className="w-4 h-4" />
                </div>
                <div className=" flex items-center" >
                  <div className="w-[30px] h-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#6EB2E4]" style={{background: 'linear-gradient(0deg, #EAF6FF 0%, #EAF6FF 100%), #FFF'}}>
                    R{pId}
                  </div>
                  <div className="px-1">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] h-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFD879]" style={{ border: '1px dashed #FFE39D'}}>
                    R{pId + 1}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-[200px] shrink-0 pl-5 flex items-center">
                  
                </div>
                <div className=" flex items-center" >
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#6EB2E4]">
                    
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFD879]">
                    <span className=" text-[10px] font-dmedium text-[#FFD879]">+</span>
                    <span className=" text-[10px] font-dbold text-[#FFD879] ml-[6px] mr-1">0.5</span>
                    <LazyImage src="/images/airdrop-refer/air-token.svg" className="w-2 h-2" />
                  </div>
                </div>
              </div>
              </>
            </Box>
            <Box>
              <>
              <div className="flex items-center">
                <div className="w-[200px] shrink-0 pl-5 flex items-center">
                  <span className=" text-[10px] font-dmedium text-[#9AADE0]">Compound income</span>
                </div>
                <div className=" flex items-center" >
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold ">
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFD879]">
                    <div className=" font-dnormal bg-[rgba(255,249,234,1)] rounded-[4px] inline-flex w-5 h-[13px] justify-center items-center text-[10px] text-[#FFB224]">
                      new
                    </div>
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold">
                    <div className=" font-dnormal bg-[#F0F2FF] rounded-[4px] inline-flex w-5 h-[13px] justify-center items-center text-[10px] text-[#889FDC]">
                      new
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-[200px] shrink-0 pl-5 flex items-center text-[#9AADE0]">
                  <span className=" text-[20px] font-dmedium ">+</span>
                  <span className=" text-[30px] font-dbold ml-[6px] mr-1">0.75</span>
                  <LazyImage src="/images/airdrop-refer/air-token.svg" className="w-4 h-4" />
                </div>
                <div className=" flex items-center" >
                  <div className="w-[30px] h-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#6EB2E4]" style={{background: 'linear-gradient(0deg, #EAF6FF 0%, #EAF6FF 100%), #FFF'}}>
                    R{pId}
                  </div>
                  <div className="px-1">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] h-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFD879]" style={{ border: '1px dashed #FFE39D'}}>
                    R{pId + 1}
                  </div>
                  <div className="px-1">
                    <LazyImage src="/images/airdrop-refer/line2.svg" />
                  </div>
                  <div className="w-[30px] h-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#B5C3E8]" style={{ border: '1px dashed #E3E6FA'}}>
                    R{pId + 2}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-[200px] shrink-0 pl-5 flex items-center">
                  
                </div>
                <div className=" flex items-center" >
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#6EB2E4]">
                    
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFD879]">
                    <span className=" text-[10px] font-dmedium text-[#FFD879]">+</span>
                    <span className=" text-[10px] font-dbold text-[#FFD879] ml-[6px] mr-1">0.5</span>
                    <LazyImage src="/images/airdrop-refer/air-token.svg" className="w-2 h-2" />
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#9AADE0]">
                    <span className=" text-[10px] font-dmedium text-[#9AADE0]">+</span>
                    {/* <div className=" text-[10px] font-dbold text-[#FFD879] ml-[6px] mr-1">0.5 <sup>2</sup></div> */}
                    <div className=" font-dbold ml-[6px]  mr-1 text-[10px]">0.5<sup>2</sup></div>

                    <LazyImage src="/images/airdrop-refer/air-token.svg" className="w-2 h-2" />
                  </div>
                </div>
              </div>
              </>
            </Box>
            <Box>
              <>
              <div className="flex items-center">
                <div className="w-[200px] shrink-0 pl-5 flex items-center">
                  <span className=" text-[10px] font-dmedium text-[#FFA68C]">Compound income</span>
                </div>
                <div className=" flex items-center" >
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold ">
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFD879]">
                    <div className=" font-dnormal bg-[rgba(255,249,234,1)] rounded-[4px] inline-flex w-5 h-[13px] justify-center items-center text-[10px] text-[#FFB224]">
                      new
                    </div>
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold">
                    <div className=" font-dnormal bg-[#F0F2FF] rounded-[4px] inline-flex w-5 h-[13px] justify-center items-center text-[10px] text-[#889FDC]">
                      new
                    </div>
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold">
                    <div className=" font-dnormal bg-[#FDF0EC] rounded-[4px] inline-flex w-5 h-[13px] justify-center items-center text-[10px] text-[#FFA68C]">
                      new
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-[200px] shrink-0 pl-5 flex items-center text-[#FFA68C]">
                  <span className=" text-[20px] font-dmedium ">+</span>
                  <span className=" text-[30px] font-dbold ml-[6px] mr-1">0.875</span>
                  <LazyImage src="/images/airdrop-refer/air-token.svg" className="w-4 h-4" />
                </div>
                <div className=" flex items-center" >
                  <div className="w-[30px] h-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#6EB2E4]" style={{background: 'linear-gradient(0deg, #EAF6FF 0%, #EAF6FF 100%), #FFF'}}>
                    R{pId}
                  </div>
                  <div className="px-1">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] h-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFD879]" style={{ border: '1px dashed #FFE39D'}}>
                    R{pId + 1}
                  </div>
                  <div className="px-1">
                    <LazyImage src="/images/airdrop-refer/line2.svg" />
                  </div>
                  <div className="w-[30px] h-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#B5C3E8]" style={{ border: '1px dashed #E3E6FA'}}>
                    R{pId + 2}
                  </div>
                  <div className="px-1">
                    <LazyImage src="/images/airdrop-refer/line3.svg" />
                  </div>
                  <div className="w-[30px] h-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[rgba(255,211,198,0.79)]" style={{ border: '1px dashed #FFEDE8'}}>
                    R{pId + 3}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-[200px] shrink-0 pl-5 flex items-center">
                  
                </div>
                <div className=" flex items-center" >
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#6EB2E4]">
                    
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFD879]">
                    <span className=" text-[10px] font-dmedium text-[#FFD879]">+</span>
                    <span className=" text-[10px] font-dbold text-[#FFD879] ml-[6px] mr-1">0.5</span>
                    <LazyImage src="/images/airdrop-refer/air-token.svg" className="w-2 h-2" />
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#9AADE0]">
                    <span className=" text-[10px] font-dmedium text-[#9AADE0]">+</span>
                    <div className=" font-dbold ml-[6px]  mr-1 text-[10px]">0.5<sup>2</sup></div>

                    <LazyImage src="/images/airdrop-refer/air-token.svg" className="w-2 h-2" />
                  </div>
                  <div className="px-1 opacity-0">
                    <LazyImage src="/images/airdrop-refer/line3.svg" />
                  </div>
                  <div className="w-[30px] rounded-[4px] flex justify-center items-center text-[16px] font-dbold text-[#FFA68C]">
                    <span className=" text-[10px] font-dmedium ">+</span>
                    <div className=" font-dbold ml-[6px]  mr-1 text-[10px]">0.5<sup>3</sup></div>

                    <LazyImage src="/images/airdrop-refer/air-token.svg" className="w-2 h-2" />
                  </div>
                </div>
              </div>
              </>
            </Box>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <div className="w-[150px] h-[150px] rounded-lg flex flex-col items-center justify-center" style={{border: '1px solid rgba(85, 123, 241, 0.30)'}}>
                <div className="text-[#8088BE] text-[8px] font-dbold">R0 - Root</div>
                <div className="mt-2">
                  <LazyImage src="/images/airdrop-refer/r08.svg" />
                </div>
                <div className="text-[#6EB2E4] text-[8px] font-dbold ml-5">R{pId} - You</div>
              </div>
            </div>
            <div className="w-[160px] h-[140px] relative flex items-end">
              <div className=" absolute right-[10px] bottom-0">
                <LazyImage src="/images/airdrop-refer/you.svg" />
              </div>
              <div className=" relative z-10 w-[140px] text-[10px] text-[rgba(63,70,100,0.5)] pb-2">
                R8: 8th referer from the root <br />
                R9: 9th referer from the root  <br />
                R10: 10th referer from the root <br />
                 R11: 11th referer from the root
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-[35px] pb-[80px]">
        <SpreadingColor value={'0.75'} />
      </div>
      
    </div>
  )
}

export default R8Compound