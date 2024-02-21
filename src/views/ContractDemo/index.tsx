import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { CollectBody, TitleWrap } from './styleds'
import { ButtonSwapUser } from '../../components/Button'
import { LoadingXUser } from '../../components/Loader'
import { useProjectContractDemo } from '../../hooks/useAirdropReceiver'
import { othersContracts } from '../../constants/contractsLocal'

function Collect() {
  const { account } = useActiveWeb3React()

  const { confirmStatus, handleCommentAction } = useProjectContractDemo()

  return (
    <div className='w-[1217px] mx-auto'>
      <CollectBody>
        <div className='flex items-center mb-10'>
          <div className=' font-fsemibold text-[32px]'>
            {'Contract Task Test'} 
          </div>
        </div>
        <div className='px-10'>
          <div className='py-3'>Contract: {othersContracts.projectContract}</div>
          <div className='py-3'>Function: comment</div>
          <div className='w-[260px] mt-10'>
            <ButtonSwapUser 
              onClick={e => {
                e.stopPropagation()
                if (confirmStatus === 1) return
                handleCommentAction()
              }}
            >
              <div className="btn-text">
                {
                  confirmStatus === 1 ? <LoadingXUser /> : 'Complete Task'
                }
              </div>
            </ButtonSwapUser>
          </div>
        </div>

        
        
      </CollectBody>
    </div>
    
  )
}

export default React.memo(Collect)
