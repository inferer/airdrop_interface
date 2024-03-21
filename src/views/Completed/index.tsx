import React from 'react'
import { CollectBody, TitleWrap } from './styleds'
import TaskList from './TaskList'
import LazyImage from '../../components/LazyImage'

function Completed() {

  return (
    <>
      <div className='w-[1217px] mx-auto'>
        <CollectBody>
          
          <div className='text-[32px] font-fsemibold mb-10 flex items-center'>
            <LazyImage src='/images/airdrop/completed.svg' className=' w-[32px] h-[32px] mr-3' />
            Completed Airdrops
          </div>
          
          <TaskList />
          
        </CollectBody>
      </div>
    </>
  )
}

export default Completed
