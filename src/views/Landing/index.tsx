'use client'

import LazyImage from "../../components/LazyImage"
import React from "react"
import styled from "styled-components"
import { useRouter } from "next/router"

export const JoinBody = styled.div`
  width: 540px;
  min-height: 521px;
  flex-shrink: 0;
  flex-shrink: 0;
  margin: 0 auto;
  border-radius: 24px;
  background: #FFF;
  padding: 11px 40px 37px;
  margin-top: 42px;
`

export const JoinTitle = styled.div`
  text-align: center;
  font-family: Inter-SemiBold;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  background: var(--airdrop, linear-gradient(135deg, #3F3CFF 6.8%, #6BBEE1 55.97%, #8AE899 101.2%));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 9px;
`

function Landing() {
  const router = useRouter()

  return (
    <JoinBody >
      <div>
        <LazyImage src="/images/airdrop/invite.png"/>
        <JoinTitle>Inferer Airdrop Protocol</JoinTitle>
        <div className="w-[480px] h-[235px] mt-10 relative">
          <LazyImage src="/images/airdrop/loading_bg.svg" className="w-full h-full" />
          <div className=" absolute left-0 right-0 bottom-8">
            <div className=" flex justify-center text-[rgba(0,0,0,0.4)] text-[14px] font-normal">Loading...</div>
            <div className="flex justify-center">
              <LazyImage src="/images/airdrop/loading_gif.svg" className="mt-3" />
            </div>
            
          </div>
        </div>

      </div>
    </JoinBody>
  )
}

export default Landing