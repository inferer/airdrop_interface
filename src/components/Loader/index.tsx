import React from 'react'

import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const moveX = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(50%);
  }
`

const StyledSVG = styled.svg<{ size: string; stroke?: string }>`
  animation: 2s ${rotate} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: ${({ stroke, theme }) => stroke ?? theme.primary1};
  }
`

const StyledSVG2 = styled.svg<{ size: string; stroke?: string }>`
  animation: 2s ${rotate} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

const StyledSVG3 = styled.svg<{ stroke?: string }>`
  animation: 2s ${moveX} linear infinite;
`

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function Loader({ size = '16px', stroke, ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" size={size} stroke={stroke} {...rest}>
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSVG>
  )
}

export function Loading({ size = '30px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path d="M3.02299 18.3752C2.2624 15.7227 2.40087 12.8931 3.41679 10.3275C4.43271 7.762 6.26899 5.60472 8.63932 4.19205C11.0096 2.77937 13.7808 2.19071 16.5207 2.51785C19.2606 2.84499 21.8153 4.06954 23.7864 6.00056C25.7575 7.93159 27.0342 10.4606 27.4176 13.1932C27.8009 15.9258 27.2693 18.7084 25.9056 21.1073C24.5419 23.5061 22.4227 25.3863 19.8786 26.4547C18.6063 26.989 17.2636 27.3052 15.9053 27.3996" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

    </StyledSVG2>
  )
}

export function LoadingX({ size = '30px', stroke, ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG3 viewBox="0 0 96 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="96" height="14">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 2.12132L4.43934 6.56066L0 11L2.12132 13.1213L7.62132 7.62132L8.68198 6.56066L7.62132 5.5L2.12132 0L0 2.12132ZM17.5 2.12132L21.9393 6.56066L17.5 11L19.6213 13.1213L25.1213 7.62132L26.182 6.56066L25.1213 5.5L19.6213 0L17.5 2.12132ZM39.4393 6.56066L35 2.12132L37.1213 0L42.6213 5.5L43.682 6.56066L42.6213 7.62132L37.1213 13.1213L35 11L39.4393 6.56066ZM52.5 2.12132L56.9393 6.56066L52.5 11L54.6213 13.1213L60.1213 7.62132L61.182 6.56066L60.1213 5.5L54.6213 0L52.5 2.12132ZM74.4393 6.56066L70 2.12132L72.1213 0L77.6213 5.5L78.682 6.56066L77.6213 7.62132L72.1213 13.1213L70 11L74.4393 6.56066ZM87 2.12132L91.4393 6.56066L87 11L89.1213 13.1213L94.6213 7.62132L95.682 6.56066L94.6213 5.5L89.1213 0L87 2.12132Z" fill="url(#paint0_linear_3725_1578)"/>
      <defs>
        <linearGradient id="paint0_linear_3725_1578" x1="8.5" y1="7" x2="89" y2="7" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7B78FF" stopOpacity="0.4"/>
          <stop offset="0.58" stopColor="#7B78FF"/>
          <stop offset="1" stopColor="#7B78FF" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
    </StyledSVG3>
  )
}

export function Confirmed() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="12.5" stroke="#6BBEE1" strokeWidth="2"/>
      <path d="M9 14.5556L13.2857 19L21 11" stroke="#6BBEE1" strokeWidth="2"/>
    </svg>
  )
}
