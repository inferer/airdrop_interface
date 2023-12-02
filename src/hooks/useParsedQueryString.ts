import { parse, ParsedQs } from 'qs'
import { useMemo } from 'react'
import { useLocation } from './useLocation'

export default function useParsedQueryString(): ParsedQs {
  const { query: search } = useLocation()
  return useMemo(
    () => ({}),
    [search]
  )
}
