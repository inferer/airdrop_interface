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
  padding: 48px 40px 30px;
  margin-top: 56px;
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

export const ItemBox2 = styled.div<{ width?: number, height?: number, error?: boolean, errorCode?: number }>`
  border-radius: 12px;
  /* border: 1px solid rgba(85, 123, 241, 0.10); */
  background: #FFF;
  width: ${({ width }) => (`${width || 380}px`)};
  height: ${({ height }) => (`${height || 100}px`)};
  background: ${({ error, errorCode }) => ( errorCode === -1 ? 'linear-gradient(180deg, #FF6060 0%, #FF2E2E 100%),linear-gradient(0deg, #FFFFFF, #FFFFFF)' : errorCode === 2 ? 'rgba(85,123,241,0.10)' : 'linear-gradient(115.46deg, #3F3CFF 6.8%, #6BBEE1 87.02%), linear-gradient(0deg, #FFFFFF, #FFFFFF)' )} ;
  background-repeat: no-repeat;
  transition: all ease-in 0.35s;
  padding: 1px;
  .content {
    border-radius: 11px;
    padding: 16px;

  }

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

