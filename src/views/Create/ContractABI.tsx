import Modal from "../../components/Modal";
import React, { useCallback, useState } from "react";
import AbiEditor from "./AbiEditor";
import LazyImage from "../../components/LazyImage";
import { ButtonCancel, ButtonSwap } from "../../components/Button";
import { useCreateContractAirdrop } from "../../hooks/useAirdropSender";

const ContractABI: React.FC<{
  isOpen: boolean
  onClose?: () => void
}> = ({
  isOpen,
  onClose
}) => {
  const [funList, setFunList] = useState<any[]>([])
  const onEditorChange = useCallback(async (code: string) => {
    try {
      const codeVal = eval(code)
      if (Array.isArray(codeVal) && codeVal.length > 0) {
        const newList = codeVal.filter(item => item.name && item.type)
        if (newList.length > 0) {
          setFunList(newList)
        }
      } else {
        setFunList([])
      }
      
    } catch(err) {
      setFunList([])
    }
  }, [])

  const { handleUpdateContractABI } = useCreateContractAirdrop()

  return (
    <Modal isOpen={isOpen} onDismiss={() => {}}
      maxHeight={600}
      minWidth="1000px"
      maxWidth="1000px"
    >
      <div className="h-[600px] w-[1000px] px-[60px] py-[24px] relative">
        <div className=" absolute right-[66px] top-[31px] cursor-pointer"
          onClick={e => {
            e.stopPropagation()
            onClose && onClose()
          }}
        >
          <LazyImage src="/images/airdrop/model_close.svg" />
        </div>
        <div className="text-[18px] font-fsemibold">Fill contract ABI</div>
        <div className="mt-[30px] flex ">
          <div className="w-[50%] shrink-0">
            <div className="text-[14px] text-[rgba(0,0,0,0.80)] flex items-center">
              <LazyImage src="/images/airdrop/code2.svg" className="mr-2" />
              Fill the contract ABI below
            </div>
            <div className=" w-[388px] h-[446px] border border-[rgba(85,123,241,0.10)] pl-4 py-3 mt-3 rounded-xl">
              <div className="h-full overflow-auto pr-4 scrollbar-container">
                <AbiEditor onChange={onEditorChange} />
              </div>
            </div>
          </div>
          <div className="w-[50%] shrink-0">
            <div className="text-[14px] text-[rgba(0,0,0,0.80)] flex items-center">
              <LazyImage src="/images/airdrop/info5.svg" className="mr-2" />
              Contract verification info
            </div>
            {
              funList.length <=0 ? 
                <div className=" mt-[29px] pb-[36px]">
                  <LazyImage src="/images/airdrop/abi_bg.png" className="w-[430px] h-[322px]" />
                </div> :
                <div>
                  <div className=" text-[12px] font-fnormal text-[rgba(0,0,0,0.80)] mt-[25px]">
                    Functions available:
                  </div>
                  <div className="mt-3 border border-[rgba(85,123,241,0.10)] p-4 h-[331px] rounded-xl overflow-auto scrollbar-container">
                    {
                      funList.map && funList.map(fun => {
                        return (
                          <div key={fun.name} className="flex items-center mb-4">
                            <LazyImage src="/images/airdrop/fun.svg" />
                            <div className=" text-black text-[14px] font-fmedium ml-2">{fun.name}</div>
                          </div>
                        )
                        
                      })
                    }
                  </div>
                </div>
            }
            
            <div className="grid grid-cols-2 gap-x-[32px] px-[81px] mt-[25px]">
              <ButtonCancel height="48px"
                onClick={e => {
                  e.stopPropagation()
                  setFunList([])
                  onClose && onClose()
                }}
              >
                <div className="btn-text">Cancel</div>
              </ButtonCancel>
              <ButtonSwap 
                disabled={funList.length <= 0}
                height="48px"
                onClick={e => {
                  e.stopPropagation()
                  if (funList.length <= 0) {
                    return
                  }
                  handleUpdateContractABI(funList)
                  onClose && onClose()
                }}
              >
                <div className="btn-text">Confirm</div>
              </ButtonSwap>
            </div>
          </div>
        </div>
        
      </div>
    </Modal>
  )
}

export default ContractABI