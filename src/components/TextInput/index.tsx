import React from 'react'
import styled from 'styled-components'
import { escapeRegExp } from '../../utils'

const StyledInput = styled.input<{ error?: boolean; fontSize?: string; align?: string, color?: string }>`
  color: ${({ color }) => (color ? color : 'rgba(0, 0, 0, 0.80)')};
  width: 100%;
  height: 100%;
  position: relative;
  font-weight: 500;
  outline: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  font-size: ${({ fontSize }) => fontSize ?? '14px'};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number
  onUserInput: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    onUserInput(nextUserInput)
    // if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
    //   onUserInput(nextUserInput)
    // }
  }

  return (
    <StyledInput
      {...rest}
      value={value}
      onChange={event => {
        // replace commas with periods, because uniswap exclusively uses period as the decimal separator
        enforcer(event.target.value)
      }}
      // universal input options
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      placeholder={placeholder || ''}
      spellCheck="false"
    />
  )
})

export default Input

