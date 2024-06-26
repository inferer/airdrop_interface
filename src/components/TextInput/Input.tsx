import React from 'react'
import styled from 'styled-components'
import { escapeRegExp } from '../../utils'

const StyledInput = styled.input<{ error?: boolean; fontSize?: string; align?: string }>`
  color: ${({ theme }) => theme.text1};
  width: 100%;
  position: relative;
  font-weight: 600;
  outline: none;
  border: none;
  flex: 1 1 auto;
  font-size: ${({ fontSize }) => fontSize ?? '32px'};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;
  font-family: Inter-SemiBold;
  margin-top: 8px;

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
    color: rgba(0, 0, 0, 0.20);
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
  focus?: boolean
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
        enforcer(event.target.value.replace(/,/g, '.'))
      }}
      title=""
      autoComplete="off"
      autoCorrect="off"
      autoFocus={Boolean(focus)}
      // text-specific options
      type="text"
      placeholder={placeholder || 'X'}
      spellCheck="false"
    />
  )
})

export default Input

