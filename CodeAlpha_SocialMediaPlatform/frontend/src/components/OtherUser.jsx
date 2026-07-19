import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FollowBtn from './FollowBtn'

const OtherUser = ({ user }) => {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  return (
    <div className='my-1 flex items-center justify-between border-b-2 border-b-gray-900 py-2'>
      <div onClick={() => { navigate(`/profile/${user.userName}`) }} className='cursor-pointer flex items-center gap-[10px]'>
        <div className='w-[50px]  rounded-full cursor-pointer overflow-hidden'>
          <img src={user.profilePic ? user.profilePic : "/empty_dp.jpg"} className='h-full w-full hover:scale-[1.09] duration-[200ms] object-cover' />
        </div>
        <div className=''>
          <div className='hover:text-gray-300 duration-150ms text-[18px]'>{user.userName}</div>
          <div className='text-[13px]  text-gray-400'>{user.name}</div>
        </div>
      </div>
      <FollowBtn tailwind={'hover:bg-gray-200 h-[40px] bg-white rounded-2xl w-[100px] text-[black] font-semibold cursor-pointer'} targetUserId={user._id} />
    </div>
  )
}

export default OtherUser