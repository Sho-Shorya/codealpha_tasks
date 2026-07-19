import React from 'react'
import LeftHome from '../components/LeftHome'
import Feed from '../components/Feed'
import RightHome from '../components/RightHome'
import ChugliChat from '../components/ChugliChat'

const home = () => {
  return (
    <div className='w-full flex justify-start items-start'>
      <LeftHome />
      <Feed />
      <RightHome />
    </div>
  )
}

export default home