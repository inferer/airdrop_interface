import { Text } from 'rebass'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
`

export const CollectBody = styled.div`
  width: 1217px;
  min-height: 606px;
  flex-shrink: 0;
  flex-shrink: 0;
  margin: 0 auto;
  border-radius: 24px;
  background: #FFF;
  padding: 40px;
  margin-top: 52px;
  margin-bottom: 52px;
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
    <div className='text-[rgba(0,0,0,0.50)] text-[14px] font-fsemibold '>{ children }</div>
  )
}

export const FlexCenter = ({ children }: { children: React.ReactElement | string}) => {
  return (
    <div className=' flex justify-center items-center'>{ children }</div>
  )
}
