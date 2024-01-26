import React from 'react'

import styled, { keyframes } from 'styled-components'
import LazyImage from '../LazyImage'

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

export function Loading2({ size = '15px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path d="M1.51149 9.18758C1.1312 7.86134 1.20043 6.44654 1.70839 5.16377C2.21635 3.881 3.13449 2.80236 4.31966 2.09602C5.50482 1.38969 6.8904 1.09536 8.26035 1.25893C9.6303 1.42249 10.9076 2.03477 11.8932 3.00028C12.8787 3.9658 13.5171 5.23028 13.7088 6.59659C13.9004 7.96289 13.6346 9.35422 12.9528 10.5536C12.2709 11.7531 11.2114 12.6932 9.9393 13.2274C9.30317 13.4945 8.63178 13.6526 7.95267 13.6998" stroke="#90B696" strokeLinecap="round" strokeLinejoin="round"/>
    </StyledSVG2>
  )
}

export function LoadingProject({ size = '30px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path d="M3.02299 18.3752C2.2624 15.7227 2.40087 12.8931 3.41679 10.3275C4.43271 7.762 6.26899 5.60472 8.63932 4.19205C11.0096 2.77937 13.7808 2.19071 16.5207 2.51785C19.2606 2.84499 21.8153 4.06954 23.7864 6.00056C25.7575 7.93159 27.0342 10.4606 27.4176 13.1932C27.8009 15.9258 27.2693 18.7084 25.9056 21.1073C24.5419 23.5061 22.4227 25.3863 19.8786 26.4547C18.6063 26.989 17.2636 27.3052 15.9053 27.3996" stroke="#3F3CFF" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </StyledSVG2>
  )
}

export function LoadingUser({ size = '30px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path d="M3.02299 18.3752C2.2624 15.7227 2.40087 12.8931 3.41679 10.3275C4.43271 7.762 6.26899 5.60472 8.63932 4.19205C11.0096 2.77937 13.7808 2.19071 16.5207 2.51785C19.2606 2.84499 21.8153 4.06954 23.7864 6.00056C25.7575 7.93159 27.0342 10.4606 27.4176 13.1932C27.8009 15.9258 27.2693 18.7084 25.9056 21.1073C24.5419 23.5061 22.4227 25.3863 19.8786 26.4547C18.6063 26.989 17.2636 27.3052 15.9053 27.3996" stroke="#6BC479" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </StyledSVG2>
  )
}
export function LoadingX({ size = '30px', stroke, ...rest }: { size?: string; stroke?: string }) {
  return <LazyImage src='/images/airdrop/loading.gif' className='w-[96px] h-[14px]' />
}

export function Confirmed() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="12.5" stroke="#6BBEE1" strokeWidth="2"/>
      <path d="M9 14.5556L13.2857 19L21 11" stroke="#6BBEE1" strokeWidth="2"/>
    </svg>
  )
}
