import React, { useState } from 'react'
import Nav from '../components/Nav'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import OnlineUser from '../components/OnlineUser'
import { setSelectedUser } from '../redux/messageSlice'
import { Cigarette, Circle } from 'lucide-react'

const Messages = () => {
  const navigate = useNavigate()
  const [searchedChat, setSearchedChat] = useState('')
  const { onlineUsers } = useSelector(state => state.socket)
  const { prevChatUsers, selectedUser } = useSelector(state => state.message)
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  return (
    <div className='bg-[black] text-white w-full h-full  px-[20px] pt-[20px]'>
      <div className='w-full flex justify-start gap-[20px] items-center'>
        <MdOutlineKeyboardBackspace className='text-white lg:hidden' size={24} onClick={() => navigate(`/`)} />
        <h1 className='font-semibold p-2'>Messages</h1>
      </div>

      <div className='w-full'>
        <input placeholder='Search chat..' value={searchedChat} onChange={(e) => { setSearchedChat(e.target.value) }} type='text' className='bg-white p-4 outline-none rounded-full text-[black] my-4 w-full h-[40px]' />
      </div>

      <div className='w-full h-[100px] flex flex-col gap-[10px] items-start  items-center overflow-x-auto border-b-2 mb-3 border-gray-800'>
        <div> {onlineUsers?.length == 1 ? "No active users" : <p>Active Users ({onlineUsers?.length-1})</p>}</div>
        <div className='w-full h-[80px] flex gap-[15px]'>
          {userData?.following?.map(user =>
            onlineUsers?.includes(user._id) &&
            <OnlineUser key={user._id} user={user} />
          )}
        </div>
      </div>

      <div className='w-full h-full overflow-auto flex flex-col gap-[5px]'>
        {prevChatUsers?.map((user, index) => (
          <div className='text-white cursor-pointer min-h-[8%] flex items-center gap-[10px]' onClick={() => { dispatch(setSelectedUser(user)); navigate("/message-area") }}>
            {onlineUsers?.includes(user._id) ?
              <OnlineUser user={user} key={index} /> :
              <div className='w-[50px] h-[50px] border-2 border-gray-600  rounded-full cursor-pointer overflow-hidden'>
                <img src={user.profilePic || './empty_dp.jpg'} alt="" className='w-full object-cover' />
              </div>
            }
            <div>
              <p>{user?.userName}</p>
              <p>{onlineUsers?.includes(user._id) ? <span className='flex items-center gap-[6px]'><div className='bg-green-600 rounded-full h-2.5 w-2.5'></div><p>online</p></span> : <span className='flex items-center gap-[6px]'><div className='bg-gray-600 rounded-full h-2.5 w-2.5'></div><p className='text-gray-400'>offline</p></span>}</p>
            </div>

          </div>))}
      </div>
    </div>
  )
}

export default Messages