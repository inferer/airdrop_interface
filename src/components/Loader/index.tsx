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

export function Loading({ size = '30px', stroke, ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path d="M3.02299 18.3752C2.2624 15.7227 2.40087 12.8931 3.41679 10.3275C4.43271 7.762 6.26899 5.60472 8.63932 4.19205C11.0096 2.77937 13.7808 2.19071 16.5207 2.51785C19.2606 2.84499 21.8153 4.06954 23.7864 6.00056C25.7575 7.93159 27.0342 10.4606 27.4176 13.1932C27.8009 15.9258 27.2693 18.7084 25.9056 21.1073C24.5419 23.5061 22.4227 25.3863 19.8786 26.4547C18.6063 26.989 17.2636 27.3052 15.9053 27.3996" stroke="#6BBEE1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

    </StyledSVG2>
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
