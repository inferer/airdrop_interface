import { useUserInfo, useUserRoleMode } from "../../state/user/hooks"
import { ButtonJoin } from "../../components/Button"
import LazyImage from "../../components/LazyImage"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import { useActiveWeb3React } from "../../hooks"
import { useWalletModalToggle } from "../../state/application/hooks"
import { LoadingJoin } from "../../components/Loader"
import { useRouter } from "next/router"
import { useOnClickOutside } from "../../hooks/useOnClickOutside"

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
  focus2?: boolean
}>`
  position: relative;
  height: 100%;
  width: 28px;
  text-align: center;
  .cursor {
    position: absolute;
    height: 20px;
    left: 0;
    top: 10px;
    width: 1px;
    background: rgba(0, 0, 0, 1);
    opacity: ${({ focus }) => (focus ? 1 : 0)};
    animation: ${({ focus }) => (focus ? 'blink 0.7s infinite alternate' : 'none')};
  }
  .cursor2 {
    position: absolute;
    height: 20px;
    right: 0;
    top: 10px;
    width: 1px;
    background: rgba(0, 0, 0, 1);
    opacity: ${({ focus2 }) => (focus2 ? 1 : 0)};
    animation: ${({ focus2 }) => (focus2 ? 'blink 0.7s infinite alternate' : 'none')};
  }

  .line {
    position: absolute;
    top: 16px;
    right: 0;
  }

  @keyframes blink {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

`

function CodeItem ({
  code,
  onClick,
  focus,
  focus2
}: {
  code: string,
  onClick?: () => void,
  focus?: boolean
  focus2?: boolean
}) {
  const codeDom = useMemo(() => {
    return code.split('')
  }, [code])

  return (
    <div className=" relative ">
      <div onClick={e => {
        e.stopPropagation()
        onClick && onClick()
      }} className={`text-[rgba(0,0,0,0.60)] text-[20px] font-fsemibold leading-[40px] h-[40px] grid grid-cols-4`} >
        <CharText focus={code.length === 0 && focus} >{codeDom[0] || ' '} 
          <div className="cursor"></div>
          <div className="line">
            <LazyImage src="/images/airdrop/join_line.svg" />
          </div>
        </CharText>
        <CharText focus={code.length === 1 && focus}>{codeDom[1] || ' '} 
          <div className="cursor"></div>
          <div className="line">
            <LazyImage src="/images/airdrop/join_line.svg" />
          </div>
        </CharText>
        <CharText focus={code.length === 2 && focus}>{codeDom[2] || ' '} 
          <div className="cursor"></div>
          <div className="line">
            <LazyImage src="/images/airdrop/join_line.svg" />
          </div>
        </CharText>
        <CharText 
          focus={code.length === 3 && focus}
          focus2={code.length === 4 && focus2}
        >
          {codeDom[3] || ' '} 
          <div className="cursor"></div>
          <div className="cursor2"></div>
        </CharText>
      </div>
      <div className={`h-[3px] absolute left-0 -bottom-[3px] w-full ${code.length >=4 ? 'bg-[rgba(0,0,0,0.1)]' : 'bg-[rgba(0,0,0,0.03)]'}`}></div>
    </div>
  )
}

function Join() {
  const router = useRouter()
  const { account, activate, deactivate } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { joinStatus, handleUserJoin, codeStatus, handleVerifyInviteCode, handleSetCodeStatus, handleGetUserInfo } = useUserInfo()
  
  const inputRef = useRef<HTMLInputElement>(null)
  const [codeValue, setCodeValue] = useState('')
  const [globalFocus, setGlobalFocus] = useState(false)

  const onChange = useCallback((value: string) => {
    setCodeValue(value)
    handleSetCodeStatus()
    if (value.length >= 16) {
      setGlobalFocus(false)
    }
  }, [codeValue, handleSetCodeStatus]) 

  const codeList = useMemo(() => {
    return {
      code1: codeValue.slice(0, 4).toUpperCase(),
      code2: codeValue.slice(4, 8).toUpperCase(),
      code3: codeValue.slice(8, 12).toUpperCase(),
      code4: codeValue.slice(12, 16).toUpperCase(),
    }
  }, [codeValue])


  useEffect(() => {
    if (codeList.code4.length >= 4) {
      const code = codeList.code1 + '-' + codeList.code2 + '-' + codeList.code3 + '-' + codeList.code4
      handleVerifyInviteCode(code.toLowerCase())
        .then((status: number) => {
          // if (status === -1) {
          //   setCodeValue('')
          // }
        })
    }
  }, [codeList, handleVerifyInviteCode])
  // 61eb208745d2b442
  // 61eb208745d2b441
  // 82fd5a4d416599f1
  const [ isProjectMode ] = useUserRoleMode()
  const [hasClick, setHasClick] = useState(false)
  useEffect(() => {
    if (account) {
      handleGetUserInfo(account)
        .then((userInfo: any) => {
          if (userInfo && userInfo.id) {
            router.push(isProjectMode ? '/project/create' : '/user/collect')
          }
        })
    }
  }, [account, isProjectMode])

  useEffect(() => {
    if (account && hasClick && codeList.code4.length >= 4 && codeStatus === 2) {
      const code = codeList.code1 + '-' + codeList.code2 + '-' + codeList.code3 + '-' + codeList.code4
      handleUserJoin(account, code.toLowerCase())
    }
  }, [account, hasClick, codeList, handleUserJoin, codeStatus])

  const node = useRef<HTMLDivElement>(null)
  useOnClickOutside(node, () => {
    setGlobalFocus(false)
  })

  useEffect(() => {
    const timer = setInterval(() => {
      if (inputRef.current) {
        clearInterval(timer)
        inputRef.current?.focus()
        setGlobalFocus(true)
      }
      
    }, 100)
  }, [])

  return (
    <JoinBody >
      <div>
        <LazyImage src="/images/airdrop/invite.png"/>
        <JoinTitle>Inferer Airdrop Protocol</JoinTitle>
        <div className="text-[rgba(0,0,0,0.40)] font-fmedium text-[16px] mt-[67px]">
          Hi, nice to have you here
        </div>
        <div ref={node} className="mt-[15px] grid grid-cols-4 gap-[8px] cursor-pointer">
          <CodeItem code={codeList.code1}
            focus={codeValue.length < 4 && globalFocus} 
            onClick={() => {
              inputRef.current?.focus()
              setGlobalFocus(true)
            }} />
          <CodeItem code={codeList.code2}
            focus={codeValue.length >= 4 && codeValue.length < 8 && globalFocus}
            onClick={() => {
              inputRef.current?.focus()
              setGlobalFocus(true)
            }} />
          <CodeItem code={codeList.code3} 
            focus={codeValue.length >= 8 && codeValue.length < 12 && globalFocus}
            onClick={() => {
              inputRef.current?.focus()
              setGlobalFocus(true)
            }} />
          <CodeItem code={codeList.code4} 
            focus={codeValue.length >= 12 && codeValue.length < 16 && globalFocus}
            focus2={codeValue.length === 16 && globalFocus}
            onClick={() => {
              inputRef.current?.focus()
              setGlobalFocus(true)
            }} />
          
        </div>
        <input ref={inputRef} type="text" className=" fixed left-[1000%]" value={codeValue} onChange={e => {
          const pattern = /^[a-zA-Z0-9]+$/;
          // if (e.target.value === '' || pattern.test(e.target.value)) {
            if (e.target.value.length >= 16) {
              inputRef.current?.blur()
            }
            onChange(e.target.value.slice(0, 16))
          // }
          
        }}  />
        <div className="text-[rgba(0,0,0,0.40)] font-normal text-[14px] mt-[11px]">
          invitation code
        </div>
        <div className="mt-[48px]">
          <ButtonJoin 
            disabled={codeValue.length < 16 || joinStatus === 1}  
            onClick={e => {
              e.stopPropagation()
              console.log(codeStatus)
              if (codeValue.length < 16 || joinStatus === 1) return
              if (codeStatus !== 2) {
                const code = codeList.code1 + '-' + codeList.code2 + '-' + codeList.code3 + '-' + codeList.code4
                handleVerifyInviteCode(code.toLowerCase())
                  .then(status => {
                    if (status === -1) {
                      setCodeValue('')
                    } else {
                      setHasClick(true)
                      if (account) {
                        
                      } else {
                        toggleWalletModal()
                      }
                      
                    }
                  })
              } else {
                setHasClick(true)
                if (!account) {
                  toggleWalletModal()
                }
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