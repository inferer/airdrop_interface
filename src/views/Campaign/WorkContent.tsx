
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { LabelText } from "./styleds";
import LazyImage from "../..//components/LazyImage";

const UploadCom0 = ({

},
ref: React.Ref<unknown> | undefined
) => {
  const filePickerRef = useRef<null | HTMLInputElement>(null)
  const [uploadFile, setUploadFile] = useState<null | File>(null)

  const addImageToPost = (e: any) => {
    setUploadFile(e.target.files[0])
  }

  useImperativeHandle(ref, () => ({
    removeFile: (e: any) => {},
    
  }))

  return (
    <div className=" cursor-pointer"
      onClick={() => {
        filePickerRef.current?.click()
      }}
    >
      <LazyImage src="/images/campaign/upload.svg" />
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        ref={filePickerRef}
        hidden
        onChange={addImageToPost}
      />
    </div>
  )
}

export const UploadCom = forwardRef(UploadCom0)

const WorkContent = () => {

  return (
    <div className="rounded-xl border border-[rgba(85, 123, 241, 0.1)] mt-5 p-5">
      <div className="flex justify-between ">
        <div>
          <LabelText>Work</LabelText>
          <div className="mt-[42px] ml-[53px]">
            <UploadCom />
          </div>
        </div>
        <div className="w-[528px] h-[277px] bg-[rgba(85,123,241,0.06)] rounded-xl p-5 relative">
          <LazyImage src="/images/campaign/work_bg.png" className="w-[148px] h-[163px] absolute top-0 right-0" />
          <div className=" relative z-10 text-[rgba(0,0,0,0.6)]">
            <div className="text-[rgba(0,0,0,0.5)] font-semibold">Summary</div>
            <div className="flex items-center text-[12px] mt-7">
              ARWEAVE TRANSACTION
              <LazyImage src="/images/airdrop/open.svg" className="ml-[5px]" />
            </div>
            <div className="flex items-center text-[12px] mt-2">
              NRSxhtMEnRIkkK4-3vodTyxlhoQXx5mD4TD46E4GQ8
            </div>
            <div className="flex items-center text-[12px] mt-[25px]">
              PROTOCOL PROOF
              <LazyImage src="/images/airdrop/open.svg" className="ml-[5px]" />
            </div>
            <div className="flex items-center text-[12px] mt-2">
              bAxelsk3nal-lsiTRfWS-Lo6PhmGim6Her5IGLE9zBU
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkContent