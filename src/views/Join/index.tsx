import { useUserInfo } from "../../state/user/hooks"
import { ButtonJoin } from "../../components/Button"
import LazyImage from "../../components/LazyImage"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import { useActiveWeb3React } from "../../hooks"
import { useWalletModalToggle } from "../../state/application/hooks"
import { LoadingJoin } from "../../components/Loader"

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

export const CharText = styled.div<{
  focus?: boolean
}>`
  position: relative;
  height: 100%;
  .cursor {
    position: absolute;
    height: 25px;
    left: 0;
    top: 7px;
    width: 1px;
    background: rgba(0, 0, 0, 0.60);
    opacity: ${({ focus }) => (focus ? 1 : 0)};
  }

`

function CodeItem ({
  code,
  onClick,
  focus
}: {
  code: string,
  onClick?: () => void,
  focus?: boolean
}) {
  const codeDom = useMemo(() => {
    return code.split('')
  }, [code])

  return (
    <div className=" relative ">
      <div onClick={e => {
        e.stopPropagation()
        onClick && onClick()
      }} className={`text-[rgba(0,0,0,0.60)] text-[24px] font-fsemibold leading-[40px] h-[40px] grid grid-cols-4`} >
        <CharText focus={code.length === 0 && focus} >{codeDom[0] || ' '} <div className="cursor"></div> </CharText>
        <CharText focus={code.length === 1 && focus}>{codeDom[1] || ' '} <div className="cursor"></div></CharText>
        <CharText focus={code.length === 2 && focus}>{codeDom[2] || ' '} <div className="cursor"></div></CharText>
        <CharText focus={code.length === 3 && focus}>{codeDom[3] || ' '} <div className="cursor"></div></CharText>
      </div>
      <div className={`h-[3px] absolute left-0 -bottom-[3px] w-full ${code.length >=4 ? 'bg-[rgba(0,0,0,0.1)]' : 'bg-[rgba(0,0,0,0.03)]'}`}></div>
    </div>
  )
}

function Join() {
  const { account, activate, deactivate } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  
  const inputRef = useRef<HTMLInputElement>(null)
  const [codeValue, setCodeValue] = useState('')
  const onChange = useCallback((value: string) => {
    
    setCodeValue(value)
  }, [codeValue]) 

  const codeList = useMemo(() => {
    return {
      code1: codeValue.slice(0, 4).toUpperCase(),
      code2: codeValue.slice(4, 8).toUpperCase(),
      code3: codeValue.slice(8, 12).toUpperCase(),
      code4: codeValue.slice(12, 16).toUpperCase(),
    }
  }, [codeValue])

  const { joinStatus, handleUserJoin, codeStatus, handleVerifyInviteCode } = useUserInfo()

  useEffect(() => {
    if (codeList.code4.length >= 4) {
      const code = codeList.code1 + '-' + codeList.code2 + '-' + codeList.code3 + '-' + codeList.code4
      handleVerifyInviteCode(code.toLowerCase())
        .then(status => {
          if (status === -1) {
            setCodeValue('')
          }
        })
    }
  }, [codeList, handleVerifyInviteCode])

  useEffect(() => {
    if (account && codeList.code4.length >= 4 && codeStatus === 2) {
      const code = codeList.code1 + '-' + codeList.code2 + '-' + codeList.code3 + '-' + codeList.code4
      handleUserJoin(account, code.toLowerCase())
    }
  }, [account, codeList, handleUserJoin, codeStatus])

  return (
    <JoinBody >
      <div>
        <LazyImage src="/images/airdrop/invite.png"/>
        <JoinTitle>Inferer Airdrop Protocol</JoinTitle>
        <div className="text-[rgba(0,0,0,0.40)] font-fmedium text-[16px] mt-[67px]">
          Hi, nice to have you here
        </div>
        <div className="mt-[15px] grid grid-cols-4 gap-[8px]">
          <CodeItem code={codeList.code1}
            focus={codeValue.length < 4} 
            onClick={() => {
              inputRef.current?.focus()
            }} />
          <CodeItem code={codeList.code2}
            focus={codeValue.length >= 4 && codeValue.length < 8}
            onClick={() => {
              inputRef.current?.focus()
            }} />
          <CodeItem code={codeList.code3} 
            focus={codeValue.length >= 8 && codeValue.length < 12}
            onClick={() => {
              inputRef.current?.focus()
            }} />
          <CodeItem code={codeList.code4} 
            focus={codeValue.length >= 12 && codeValue.length < 16}
            onClick={() => {
              inputRef.current?.focus()
            }} />
          
        </div>
        <input ref={inputRef} type="text" className=" fixed left-[1000%]" value={codeValue} onChange={e => {
          const pattern = /^[a-zA-Z0-9]+$/;
          if (e.target.value === '' || pattern.test(e.target.value)) {
            if (e.target.value.length >= 16) {
              inputRef.current?.blur()
            }
            onChange(e.target.value)
          }
          
        }}  />
        <div className="text-[rgba(0,0,0,0.40)] font-normal text-[14px] mt-[11px]">
          invitation code
        </div>
        <div className="mt-[48px]">
          <ButtonJoin 
            disabled={codeValue.length < 16 || joinStatus === 1}  
            onClick={e => {
              e.stopPropagation()
              if (codeValue.length < 16 || joinStatus === 1) return
              if (codeStatus !== 2) {
                const code = codeList.code1 + '-' + codeList.code2 + '-' + codeList.code3 + '-' + codeList.code4
                handleVerifyInviteCode(code.toLowerCase())
              } else {
                toggleWalletModal()
              }
            }}
          >
            {
              (joinStatus === 1 || codeStatus === 1) ? 
              <LoadingJoin /> : 
              <div className="btn-text">
                Join protocol now
              </div>
            }
            
          </ButtonJoin>
        </div>
      </div>
    </JoinBody>
  )
}

export default Join