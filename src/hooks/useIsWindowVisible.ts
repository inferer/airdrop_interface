import { useCallback, useEffect, useState } from 'react'



function isWindowVisible() {
  return 
}

/**
 * Returns whether the window is currently visible to the user.
 */
export default function useIsWindowVisible(): boolean {
  const [focused, setFocused] = useState<boolean>(false)
  const listener = useCallback(() => {
    setFocused(document.visibilityState !== 'hidden')
  }, [setFocused])

  useEffect(() => {
    const VISIBILITY_STATE_SUPPORTED = 'visibilityState' in document

    if (!VISIBILITY_STATE_SUPPORTED) return undefined
    setFocused(!VISIBILITY_STATE_SUPPORTED || document.visibilityState !== 'hidden')

    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
    }
  }, [listener])

  return focused
}
