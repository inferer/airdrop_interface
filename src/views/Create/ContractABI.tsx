import Modal from "../../components/Modal";
import React from "react";
import AbiEditor from "./AbiEditor";
import LazyImage from "../../components/LazyImage";

const ContractABI = () => {
  return (
    <Modal isOpen={true} onDismiss={() => {}}
      maxHeight={600}
      minWidth="1000px"
      maxWidth="1000px"
    >
      <div className="h-[600px] w-[1000px] px-[60px] py-[24px]">
        <div className="text-[18px] font-fsemibold">Fill contract ABI</div>
        <div className="mt-[30px] flex ">
          <div className="w-[50%] shrink-0">
            <div className="text-[14px] text-[rgba(0,0,0,0.80)] flex items-center">
              <LazyImage src="/images/airdrop/code2.svg" className="mr-2" />
              Fill the contract ABI below
            </div>
            <div className=" overflow-auto w-[388px] h-[422px] border border-[rgba(85,123,241,0.10)] px-4 py-3 mt-3 rounded-xl">
              <AbiEditor />
            </div>
          </div>
          <div className="w-[50%] shrink-0">
            <div className="text-[14px] text-[rgba(0,0,0,0.80)] flex items-center">
              <LazyImage src="/images/airdrop/info5.svg" className="mr-2" />
              Contract verification info
            </div>
          </div>
        </div>
        
      </div>
    </Modal>
  )
}

export default ContractABI