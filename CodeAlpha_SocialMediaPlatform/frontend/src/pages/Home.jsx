import React from 'react'
import LeftHome from '../components/LeftHome'
import Feed from '../components/Feed'

const home = () => {
  return (
    <div className='w-full flex justify-center items-start'>
      <LeftHome/>
      <Feed/>
    </div>
  )
}

export default home