import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '../redux/messageSlice'

const OnlineUser = ({ user }) => {
  const navigate = useNavigate()
  const { onlineUsers } = useSelector(state => state.socket)
  const { userData } = useSelector(state => state.user)

  const dispatch = useDispatch()

  return (
    <div className='w-[50px] h-[50px] relative flex items-center'>
      <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
        <img onClick={() => { dispatch(setSelectedUser(user)); navigate(`/message-area`) }} src={user?.profilePic ? user?.profilePic : "./empty_dp.jpg"} className='h-full cursor-pointer w-full object-cover ' />
      </div>
      <div className='w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 top-0'></div>
    </div>
  )
}

export default OnlineUser