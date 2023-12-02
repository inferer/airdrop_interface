import React from 'react'

import Link from 'next/link'

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/

export function RedirectOldRemoveLiquidityPathStructure({
  match: {
    params: { tokens }
  }
}: any) {
  if (!OLD_PATH_STRUCTURE.test(tokens)) {
    return <Link href="/pool" />
  }
  const [currency0, currency1] = tokens.split('-')

  return <Link href={`/remove/${currency0}/${currency1}`} />
}
