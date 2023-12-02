import { stringify } from 'qs'
import React, { useCallback, useMemo, useState } from 'react'
import { useLocation } from '../../hooks/useLocation'
import Link from 'next/link'
import styled from 'styled-components'
import { useUserRoleMode } from '../../state/user/hooks'
import { UserRoleMode } from '../../constants'

const VersionLabel = styled.span<{ enabled: boolean }>`
  padding: 0.35rem 0.6rem;
  border-radius: 12px;
  background: ${({ theme, enabled }) => (enabled ? theme.primary1 : 'none')};
  color: ${({ theme, enabled }) => (enabled ? theme.white : theme.text1)};
  font-size: 1rem;
  font-weight: ${({ enabled }) => (enabled ? '500' : '400')};
  :hover {
    user-select: ${({ enabled }) => (enabled ? 'none' : 'initial')};
    background: ${({ theme, enabled }) => (enabled ? theme.primary1 : 'none')};
    color: ${({ theme, enabled }) => (enabled ? theme.white : theme.text1)};
  }
`

interface VersionToggleProps extends React.ComponentProps<typeof Link> {
  enabled: boolean
}

const VersionToggle = styled.div<{ enabled: boolean }>`
  border-radius: 12px;
  opacity: ${({ enabled }) => (enabled ? 1 : 0.5)};
  cursor: ${({ enabled }) => (enabled ? 'pointer' : 'default')};
  background: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.primary1};
  display: flex;
  width: fit-content;
  margin-left: 0.5rem;
  text-decoration: none;
  :hover {
    text-decoration: none;
  }
`

const VersionToggleWap = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding-right: 100px;
`

export default function VersionSwitch() {
  const [ isProjectMode, toggleSetUserRoleMode] = useUserRoleMode()

  const location = useLocation()
  const versionSwitchAvailable = location.pathname === '/swap'

  const handleClick = useCallback(
    e => {
      if (!versionSwitchAvailable) e.preventDefault()
      toggleSetUserRoleMode()
    },
    [versionSwitchAvailable, toggleSetUserRoleMode]
  )

  const toggle = (
    <VersionToggleWap>
      <VersionToggle enabled={versionSwitchAvailable} onClick={handleClick}>
        <VersionLabel enabled={isProjectMode || !versionSwitchAvailable}>Project</VersionLabel>
        <VersionLabel enabled={!isProjectMode && versionSwitchAvailable}>User</VersionLabel>
      </VersionToggle>
    </VersionToggleWap>
  )
  return versionSwitchAvailable ? (
    toggle
  ) : null
}
