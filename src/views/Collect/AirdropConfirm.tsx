
import React from "react";
import LazyImage from "../../components/LazyImage";
import { FlexCenter, LabelText } from "./styleds";
import { ButtonSwap } from "../../components/Button";
import { TYPE } from "../../theme";

const AirdropConfirm: React.FC<{

}> = () => {
  return (
    <div className="p-5">
      <div className=" text-[36px] font-fsemibold leading-[42px]">Azuki new users plan</div>
      <div className="flex items-start mt-11">
        <div className="w-[420px]">
          <div className="flex items-center">
            <div className="w-[160px] shrink-0">
              <LabelText>Label</LabelText>
            </div>
            <div>
              <div className="text-[rgba(63,60,255,0.8)] text-[16px] font-fmedium rounded-lg bg-[rgba(63,60,255,0.05)] px-2">
                <FlexCenter>Social</FlexCenter>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-7">
            <div className="w-[160px] shrink-0">
              <LabelText>Channel</LabelText>
            </div>
            <div>
              <LazyImage src="/images/channel/twitter.svg" className=" rounded-full" />
            </div>
          </div>
          <div className="flex items-center mt-7">
            <div className="w-[160px] shrink-0">
              <LabelText>Expire On</LabelText>
            </div>
            <div>
              30/11/2023 22:50
            </div>
          </div>
        </div>

        <div className=" flex-1 relative -top-[5px]">
          <div className="flex items-center">
            <div className="w-[160px] shrink-0">
              <LabelText>Fund</LabelText>
            </div>
            <div className="flex items-baseline">
              <div className=" font-fmedium text-[22px]">1,000 </div>
              <div className="text-[16px] ml-2">USDC</div>
            </div>
          </div>
          <div className="flex items-center mt-5">
            <div className="w-[160px] shrink-0">
              <LabelText>Action</LabelText>
            </div>
            <div className="py-[2px] px-[10px] flex justify-between items-center rounded border border-[rgba(0,0,0,0.06)]">
              <span className=" text-[16px] font-fsemibold">Like</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <LabelText>Content</LabelText>
        <div className="p-4 rounded-xl bg-[rgba(85,123,241,0.03)] font-fnormal h-[100px] mt-3">
          https://twitter.com/intent/like?tweet_id=17203739135769 52121
        </div>
      </div>
      <div className="p-4 rounded-xl bg-[rgba(123,120,255,0.04)] font-fnormal mt-3">
        <div className=" text-[rgba(123,120,255,0.80)] text-[16px] font-fsemibold ">Airdrop token would be issued from contract.</div>
        <div className=" text-[rgba(123,120,255,0.80)] text-[14px] font-normal mt-2 leading-[18px] ">Once you confirmed the airdrop, the alg-* token would be locked in protocol until the airdrop content gets done. And the alg-* token would be transformed into air-* token and transferred into your account for later trade in airdrop pools..</div>
      </div>
      <div className=" flex justify-center mt-[50px]">
        <div className='w-[260px] mr-[180px]'>
          <ButtonSwap 
            altDisabledStyle
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <div className="text-[rgba(0,0,0,0.60)] text-[20px] font-fsemibold">Cancel</div>
          </ButtonSwap>
        </div>
        <div className='w-[260px]'>
          <ButtonSwap 
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <TYPE.textGrad1 fontWeight={600} fontSize={20}>
              {
                'Confirm'
              }
            </TYPE.textGrad1>
          </ButtonSwap>
        </div>
      </div>
    </div>
  )
}

export default AirdropConfirm