import React from 'react'
import styled from 'styled-components'
import { darken, lighten } from 'polished'

import { RowBetween } from '../Row'
import { ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'

const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '18px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 500;
  text-align: center;
  border-radius: 20px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.primary1 : theme.bg3)};
    color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? 'white' : theme.text3)};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

export const ButtonLight = styled(Base)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primaryText1};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.primary5};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg2)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg2)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg2)};
  }
`

export const ButtonSecondary = styled(Base)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primaryText1};
  font-size: 16px;
  border-radius: 8px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    background-color: ${({ theme }) => theme.primary4};
  }
  &:hover {
    background-color: ${({ theme }) => theme.primary4};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    background-color: ${({ theme }) => theme.primary4};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.primary5};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonPink = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: white;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.primary1};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    background-color: ${({ theme }) => theme.advancedBG};
  }
  &:hover {
    background-color: ${({ theme }) => theme.advancedBG};
  }
  &:active {
    background-color: ${({ theme }) => theme.advancedBG};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonWhite = styled(Base)`
  border: 1px solid #edeef2;
  background-color: ${({ theme }) => theme.bg1};
  color: black;

  &:focus {
    box-shadow: 0 0 0 1pt ${darken(0.05, '#edeef2')};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.green1)};
  color: ${({ theme }) => theme.green1};
  border: 1px solid ${({ theme }) => theme.green1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
  }
`

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonWhite {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}
export const ButtonSwap = styled.div<{
  bgColor?: string
  padding?: string
  width?: string
  height?: string
  borderRadius?: string
  disabled?: boolean
}>`
  background-repeat: no-repeat;
  background: ${({ bgColor, disabled }) => ( disabled ? 'linear-gradient(108deg, rgba(63, 60, 255, 0.03) 24.12%, rgba(107, 190, 225, 0.03) 51.08%, rgba(138, 232, 153, 0.03) 75.88%)' : bgColor ? bgColor : 'linear-gradient(96deg, rgba(63, 60, 255, 0.06) 0%, rgba(107, 190, 225, 0.06) 101.71%)')} ;
  
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => ( height ? height: '60px')};
  border-radius: ${({ borderRadius }) => borderRadius ? borderRadius : '12px'};
  outline: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  padding-left: 15px;
  padding-right: 15px;
  &:disabled {
    cursor: auto;
  }

  .btn-text {
    background: ${({ disabled }) => ( disabled ? 'linear-gradient(135deg, rgba(63, 60, 255, 0.30) 6.8%, rgba(107, 190, 225, 0.30) 55.97%, rgba(138, 232, 153, 0.30) 101.2%)' : 'linear-gradient(96deg, #3F3CFF 0%, #6BBEE1 101.71%)')} ;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Inter-SemiBold;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  
  &:hover {
    background: ${({ disabled }) => ( disabled ? 'linear-gradient(108deg, rgba(63, 60, 255, 0.03) 24.12%, rgba(107, 190, 225, 0.03) 51.08%, rgba(138, 232, 153, 0.03) 75.88%)' : 'linear-gradient(96deg, rgba(63, 60, 255, 0.12) 0%, rgba(107, 190, 225, 0.12) 101.71%)')} ;
    .bnt-text {
      background: linear-gradient(96deg, #2825FF 0%, #31BAF3 101.71%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  > * {
    user-select: none;
  }
`
export const ButtonSwapUser = styled.div<{
  bgColor?: string
  padding?: string
  width?: string
  height?: string
  borderRadius?: string
  disabled?: boolean
}>`
  background-repeat: no-repeat;
  background: ${({ bgColor, disabled }) => ( disabled ? 'linear-gradient(108deg, rgba(63, 60, 255, 0.03) 24.12%, rgba(107, 190, 225, 0.03) 51.08%, rgba(138, 232, 153, 0.03) 75.88%)' : bgColor ? bgColor : 'linear-gradient(135deg, rgba(107, 190, 225, 0.06) 0%, rgba(138, 232, 153, 0.06) 100%)')} ;
  
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => ( height ? height: '60px')};
  border-radius: ${({ borderRadius }) => borderRadius ? borderRadius : '12px'};
  outline: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  padding-left: 15px;
  padding-right: 15px;
  &:disabled {
    cursor: auto;
  }

  .btn-text {
    background: linear-gradient(135deg, #6BBEE1 0%, #7CD5B9 55.05%, #8AE899 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Inter-SemiBold;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  
  &:hover {
    background: ${({ disabled }) => ( disabled ? 'linear-gradient(108deg, rgba(63, 60, 255, 0.03) 24.12%, rgba(107, 190, 225, 0.03) 51.08%, rgba(138, 232, 153, 0.03) 75.88%)' : 'linear-gradient(135deg, rgba(107, 190, 225, 0.12) 0%, rgba(138, 232, 153, 0.12) 100%)')} ;
  }

  > * {
    user-select: none;
  }
`
export const ButtonCancel = styled.div<{
  bgColor?: string
  padding?: string
  width?: string
  height?: string
  borderRadius?: string
  disabled?: boolean
}>`
  background-repeat: no-repeat;
  background: #FAFAFA;
  
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => ( height ? height: '60px')};
  border-radius: ${({ borderRadius }) => borderRadius ? borderRadius : '12px'};
  outline: none;
  border: 1px solid transparent;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  padding-left: 15px;
  padding-right: 15px;
  &:disabled {
    cursor: auto;
  }

  .btn-text {
    color: rgba(0, 0, 0, 0.60);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  
  &:hover {
    background: #F5F5F5;
    .btn-text {
      color: rgba(0, 0, 0, 0.80);
    }
  }

  > * {
    user-select: none;
  }
`
