import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const OtherUser = ({ user }) => {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user)
  return (
    <div onClick={() => {navigate(`/profile/${user.userName}`)}} className='my-1 flex items-center justify-between border-b-2 border-b-gray-900 py-2'>
      <div className='flex items-center gap-[10px]'>
        <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
          <img src={user.profilePic ? user.profilePic : "/empty_dp.jpg"} className='h-full w-full object-cover' />
        </div>
        <div>
          <div className='text-[18px]'>{user.userName}</div>
          <div className='text-[13px]  text-gray-400'>{user.name}</div>
        </div>
      </div>
      <button className=' h-[40px] bg-white rounded-2xl w-[100px] text-[black] font-semibold cursor-pointer'>
        Follow
      </button>
    </div>
  )
}

export default OtherUser