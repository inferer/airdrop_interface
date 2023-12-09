import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'
import {  TYPE } from '../../theme'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import LazyImage, { LazyImage2 } from '../../components/LazyImage'
import TaskList from './TaskList'
import router from 'next/router'
import { useAirdropReceiver } from '../../hooks/useAirdropReceiver'
import { ButtonSwap } from '../../components/Button'

function Collect() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const { handleCompleteTask } = useAirdropReceiver()

  const [ids, setIds] = useState<string[]>([])
  const handleOnChecked = (keys: string[]) => {
    console.log(keys)
    setIds(keys)
  }

  return (
    <>
      <div className='w-[1217px] mx-auto'>
        <TitleWrap>
          <TYPE.textGrad1 fontSize={32} fontWeight={600}>
            {'Ongoing airdrops'} 
          </TYPE.textGrad1>
        </TitleWrap>
        <CollectBody>
          <TaskList onChecked={handleOnChecked} />
        </CollectBody>
        <div className=" flex justify-end">
          <div className='w-[260px]'>
            <ButtonSwap 
              onClick={e => {
                e.stopPropagation()
                handleCompleteTask(ids)
              }}
            >
              <TYPE.textGrad1 fontWeight={600} fontSize={20}>
                {
                  'Confirm'
                }
              </TYPE.textGrad1>
            </ButtonSwap>
          </div>
        </div>
      </div>
    </>
  )
}

export default React.memo(Collect)
