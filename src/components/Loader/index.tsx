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
      <path d="M3.02299 18.3752C2.2624 15.7227 2.40087 12.8931 3.41679 10.3275C4.43271 7.762 6.26899 5.60472 8.63932 4.19205C11.0096 2.77937 13.7808 2.19071 16.5207 2.51785C19.2606 2.84499 21.8153 4.06954 23.7864 6.00056C25.7575 7.93159 27.0342 10.4606 27.4176 13.1932C27.8009 15.9258 27.2693 18.7084 25.9056 21.1073C24.5419 23.5061 22.4227 25.3863 19.8786 26.4547C18.6063 26.989 17.2636 27.3052 15.9053 27.3996" stroke="#3F3CFF" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </StyledSVG2>
  )
}

export function LoadingUser({ size = '30px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path d="M3.02299 18.3752C2.2624 15.7227 2.40087 12.8931 3.41679 10.3275C4.43271 7.762 6.26899 5.60472 8.63932 4.19205C11.0096 2.77937 13.7808 2.19071 16.5207 2.51785C19.2606 2.84499 21.8153 4.06954 23.7864 6.00056C25.7575 7.93159 27.0342 10.4606 27.4176 13.1932C27.8009 15.9258 27.2693 18.7084 25.9056 21.1073C24.5419 23.5061 22.4227 25.3863 19.8786 26.4547C18.6063 26.989 17.2636 27.3052 15.9053 27.3996" stroke="#6BC479" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </StyledSVG2>
  )
}

export function LoadingProjectBalance({ size = '15px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path d="M1.51149 9.68758C1.1312 8.36134 1.20043 6.94654 1.70839 5.66377C2.21635 4.381 3.13449 3.30236 4.31966 2.59602C5.50482 1.88969 6.8904 1.59536 8.26035 1.75893C9.6303 1.92249 10.9076 2.53477 11.8932 3.50028C12.8787 4.4658 13.5171 5.73028 13.7088 7.09659C13.9004 8.46289 13.6346 9.85422 12.9528 11.0536C12.2709 12.2531 11.2114 13.1932 9.9393 13.7274C9.30317 13.9945 8.63178 14.1526 7.95267 14.1998" stroke="url(#paint0_linear_4028_2775)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
      <linearGradient id="paint0_linear_4028_2775" x1="14.1986" y1="11.6672" x2="1.01574" y2="9.47094" gradientUnits="userSpaceOnUse">
      <stop stopColor="#3F3CFF"/>
      <stop offset="1" stopColor="#6BBEE1"/>
      </linearGradient>
      </defs>
    </StyledSVG2>
  )
}
export function LoadingUserBalance({ size = '15px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path d="M1.51149 9.68758C1.1312 8.36134 1.20043 6.94654 1.70839 5.66377C2.21635 4.381 3.13449 3.30236 4.31966 2.59602C5.50482 1.88969 6.8904 1.59536 8.26035 1.75893C9.6303 1.92249 10.9076 2.53477 11.8932 3.50028C12.8787 4.4658 13.5171 5.73028 13.7088 7.09659C13.9004 8.46289 13.6346 9.85422 12.9528 11.0536C12.2709 12.2531 11.2114 13.1932 9.9393 13.7274C9.30317 13.9945 8.63178 14.1526 7.95267 14.1998" stroke="url(#paint0_linear_4028_2764)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="paint0_linear_4028_2764" x1="14.9197" y1="3.84589" x2="9.39985" y2="13.4377" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6BBEE1"/>
        <stop offset="1" stopColor="#8AE899"/>
        </linearGradient>
      </defs>
    </StyledSVG2>
  )
}
export function LoadingContract({ size = '20px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
        <path d="M3.03149 11.9587C2.58875 10.4147 2.66935 8.7676 3.26072 7.2742C3.85209 5.78079 4.92099 4.52504 6.30076 3.70272C7.68053 2.8804 9.29362 2.53774 10.8885 2.72817C12.4834 2.9186 13.9705 3.63141 15.1179 4.75546C16.2652 5.87951 17.0084 7.35163 17.2316 8.94228C17.4547 10.5329 17.1453 12.1527 16.3515 13.5491C15.5576 14.9455 14.3241 16.0399 12.8432 16.6618C12.1026 16.9728 11.3209 17.1569 10.5303 17.2119" stroke="#7B78FF" strokeOpacity="0.5" strokeWidth="1.1642" strokeLinecap="round" strokeLinejoin="round"/>
    </StyledSVG2>
  )
}
export function LoadingJoin({ size = '30px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path d="M3.02299 18.3752C2.2624 15.7227 2.40087 12.8931 3.41679 10.3275C4.43271 7.762 6.26899 5.60472 8.63932 4.19205C11.0096 2.77937 13.7808 2.19071 16.5207 2.51785C19.2606 2.84499 21.8153 4.06954 23.7864 6.00056C25.7575 7.93159 27.0342 10.4606 27.4176 13.1932C27.8009 15.9258 27.2693 18.7084 25.9056 21.1073C24.5419 23.5061 22.4227 25.3863 19.8786 26.4547C18.6063 26.989 17.2636 27.3052 15.9053 27.3996" stroke="#363636" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </StyledSVG2>
  )
}
export function LoadingUint({ size = '20px', stroke = '#6BBEE1', ...rest }: { size?: string; stroke?: string }) {
  return (
    <StyledSVG2 viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" size={size}>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.4902 16.631C11.2175 16.5804 11.9366 16.4111 12.618 16.125C13.9804 15.5528 15.1153 14.5459 15.8456 13.2612C16.5759 11.9766 16.8606 10.4864 16.6553 9.02297C16.45 7.55956 15.7663 6.20522 14.7107 5.17109C13.6551 4.13696 12.287 3.48117 10.8197 3.30598C9.3524 3.13079 7.86836 3.44603 6.59897 4.20257C5.32958 4.9591 4.34619 6.1144 3.80213 7.48833C3.25807 8.86226 3.18392 10.3776 3.59124 11.7981C3.67985 12.1071 3.50117 12.4295 3.19214 12.5181C2.88311 12.6067 2.56075 12.428 2.47214 12.119C1.99398 10.4515 2.08103 8.67258 2.71971 7.0597C3.35839 5.44683 4.5128 4.09061 6.00295 3.2025C7.4931 2.3144 9.23524 1.94433 10.9577 2.14999C12.6802 2.35565 14.2863 3.12548 15.5254 4.33946C16.7646 5.55344 17.5673 7.14333 17.8082 8.86123C18.0492 10.5791 17.715 12.3285 16.8577 13.8366C16.0004 15.3447 14.6682 16.5267 13.0687 17.1983C12.2689 17.5342 11.4247 17.733 10.5709 17.7924C10.2502 17.8147 9.9721 17.5728 9.94982 17.252C9.92753 16.9313 10.1695 16.6533 10.4902 16.631Z" fill="url(#paint0_linear_295_183)" fillOpacity="0.5"/>
      <defs>
      <linearGradient id="paint0_linear_295_183" x1="19.7461" y1="15.3408" x2="2.5286" y2="18.4639" gradientUnits="userSpaceOnUse">
      <stop stopColor="#3F3CFF"/>
      <stop offset="1" stopColor="#6BBEE1"/>
      </linearGradient>
      </defs>
    </StyledSVG2>
  )
}

export function LoadingX({ size = '30px', stroke, ...rest }: { size?: string; stroke?: string }) {
  return <LazyImage src='/images/airdrop/loading.gif' className='w-[96px] h-[14px]' />
}

export function LoadingXUser({ size = '30px', stroke, ...rest }: { size?: string; stroke?: string }) {
  return <LazyImage src='/images/airdrop/loading-user.gif' className='w-[96px] h-[14px]' />
}

export function Confirmed() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="12.5" stroke="#6BBEE1" strokeWidth="2"/>
      <path d="M9 14.5556L13.2857 19L21 11" stroke="#6BBEE1" strokeWidth="2"/>
    </svg>
  )
}
