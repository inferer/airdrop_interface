import { Text } from 'rebass'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
`

export const CollectBody = styled.div`
  width: 708px;
  min-height: 606px;
  flex-shrink: 0;
  flex-shrink: 0;
  margin: 0 auto;
  border-radius: 24px;
  background: #FFF;
  padding: 40px;
  margin-top: 42px;
`

export const TitleWrap = styled.div`
  display: flex;
  align-items: center;

  .icon-left {
    margin-right: 32px;
  }

`

export const LabelText = ({ children }: { children: React.ReactElement | string}) => {
  return (
    <div className='text-[rgba(0,0,0,0.40)] text-[16px] font-fsemibold '>{ children }</div>
  )
}

export const FlexCenter = ({ children }: { children: React.ReactElement | string}) => {
  return (
    <div className=' flex justify-center items-center'>{ children }</div>
  )
}


export const TokensBody = styled.div`
  width: 628px;
  border-radius: 24px;
  background: #FFF;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  padding: 30px;
  margin-top: 26px;
`
