import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { API_BASE_URL } from '../lib/constants'
import { toast } from 'sonner'
import { setUserData } from '../redux/userSlice'
import OtherUser from './OtherUser'
import { FaRegHeart } from "react-icons/fa6"

const LeftHome = () => {
  const { userData, suggestedUsers } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {

      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(setUserData(null))
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  return (
    <div className='w-[25%] hidden lg:block min-h-[100vh] bg-[Black] border-r-2 border-gray-900'>
      <div className='w-full h-[110px] flex  items-center justify-between'>
        <a href='/'><img className='mt-8 ml-4 cursor-pointer w-[200px]' src='/Chugli_trans3.png' alt='Chugli' /></a>
        <a href='/'><FaRegHeart className='mt-1 mr-6 text-white h-[25px] w-[25px]' /></a>
      </div>
      <div className='mx-5 my-3 flex items-center justify-between border-b-2 border-b-gray-900 py-2'>
        <div className='flex items-center gap-[10px]'>
          <div className='w-[60px] h-[60px] border-2 border-black rounded-full cursor-pointer border-1 border-gray-900 overflow-hidden'>
            <img src={userData.profilePic ? userData.profilePic : "/empty_dp.jpg"} className='w-full h-full object-cover' />
          </div>
          <div>
            <div className='text-[18px]'>{userData.userName}</div>
            <div className='text-[13px]  text-gray-400'>{userData.name}</div>
          </div>
        </div>
        <div onClick={handleLogout} className='text-blue-500 font-semibold cursor-pointer'>
          logout
        </div>
      </div>
      <div className='w-full flex flex-col gap-[20px] p-[20px]'>
        <h1 className='text-[15px] ml-1'>Suggested Users</h1>
        <div className=''>
          {suggestedUsers && suggestedUsers.slice(0, 3).map((user, index) => (
            <OtherUser key={index} user={user} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default LeftHome
