import { Text } from 'rebass'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
`

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary1};
`
export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.primary1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

export const CreateBody = styled.div`
  width: 1217px;
  min-height: 606px;
  flex-shrink: 0;
  flex-shrink: 0;
  margin: 0 auto;
  border-radius: 24px;
  background: #FFF;
  padding: 53px 40px;
`

export const TitleWrap = styled.div`
  display: flex;
  align-items: center;

  .icon-left {
    margin-right: 32px;
  }

`
export const ItemWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;

`
export const ItemBox = styled.div<{ width?: number, height?: number }>`
  border-radius: 12px;
  border: 1px solid rgba(85, 123, 241, 0.10);
  background: #FFF;
  width: ${({ width }) => (`${width || 380}px`)};
  height: ${({ height }) => (`${height || 115}px`)};
  padding: 16px;

`
export const ItemCenter = styled.div`
  background: #FAFAFA;
  width: 1px;
  height: 385px;
  flex-shrink: 0;
  margin: 0 46px;

`
export const ItemTitle = styled.div`
  color: rgba(0, 0, 0, 0.50);
  font-family: Inter-SemiBold;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

`

export const TokenInfo = styled.div`
  display: flex;
  padding: 4px 12px;
  align-items: center;
  gap: 4px;
  border-radius: 15px;
  background: rgba(85, 123, 241, 0.06);

`

