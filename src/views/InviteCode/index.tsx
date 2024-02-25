import { useRouter } from "next/router"
import LazyImage from "../../components/LazyImage"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import useCopyClipboard from "../../hooks/useCopyClipboard"
import { Tooltip2 } from "../../components/Tooltip"
import { useActiveWeb3React } from "../../hooks"
import { useUserInfo } from "../../state/user/hooks"

export const JoinBody = styled.div`
  width: 628px;
  min-height: 636px;
  flex-shrink: 0;
  flex-shrink: 0;
  margin: 0 auto;
  border-radius: 24px;
  background: #FFF;
  padding: 30px;
  margin-top: 42px;
`

const CodeWrap = styled.div<{ 
  project?: boolean 
}>`
  background-image: ${({ project }) => (project ? "url('/images/airdrop/invite_bg1.png')" : "url('/images/airdrop/invite_bg2.png')")};
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 568px;
  height: 135px;
  margin-top: 20px;
  border-radius: 6px;

  .item-text {
    background: ${({ project }) => (project ? "linear-gradient(131deg, #3836EC 6.08%, #5AAEFC 97.02%)" : "linear-gradient(135deg, #6BBEE1 0%, #8AE899 100%)")} ;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const CodeItem = ({
  code,
  project
}: {
  code?: string
  project?: boolean
}) => {
  const [ isCopied, staticCopy ] = useCopyClipboard()
  return (
    <div className="text-[14px] font-fmedium flex items-center " style={{ letterSpacing: '0.28px'}}>
      <div className="item-text uppercase">{code}</div>
      <div
        onClick={e => {
          e.stopPropagation()
          staticCopy(code?.replace(/-/g, '') || '')
        }}
      >
        <Tooltip2 text={isCopied ? 'Copied' : 'Copy' } >
          <LazyImage className="ml-1 cursor-pointer" src={project ? "/images/airdrop/copy3.svg" : "/images/airdrop/copy4.svg"} />
        </Tooltip2>
      </div>
    </div>
  )
}
// 6f4f0eb84982a93a
// ecd08e2644c8b19f

function InviteCode() {
  const router = useRouter()
  const isProject = router.pathname === '/project/[action]'
  const { account } = useActiveWeb3React()
  const [inviteCodeList, setInviteCodeList] = useState<any[]>([])
  const { handleGetUserInviteCode } = useUserInfo()

  useEffect(() => {
    if (account) {
      handleGetUserInviteCode(account)
        .then((data: any[]) => {
          console.log(data)
          setInviteCodeList(data)
        })
    }
  }, [account])

  return (
    <JoinBody >
      <div className="text-[18px] font-fsemibold text-black">Invitation code</div>
      <CodeWrap project={isProject}>
        <div className="p-[20px] grid grid-cols-2 gap-x-[100px] gap-y-[16px]">
          {
            inviteCodeList.map(item => <CodeItem key={item.inviteCode} project={isProject} code={item.inviteCode} />)
          }
        </div>
      </CodeWrap>

      <div className="text-[rgba(0,0,0,0.40)] text-[12px] font-fmedium">
        <div className="mt-[40px] mb-[15px] " style={{ letterSpacing: '0.24px' }}>Note</div>
        <div>1: Each would have 6 unique invitation codes. </div>
        <div>2: Invitation code could only be redeemed once.</div>
        <div>3: For Inferer Airdrop NFT holder (OG Pass Holder), there’ll be additional 10 unique invitation codes.</div>
      </div>
    </JoinBody>
  )
}

export default InviteCode