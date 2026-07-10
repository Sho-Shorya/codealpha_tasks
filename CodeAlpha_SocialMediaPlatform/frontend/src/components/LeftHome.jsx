import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { API_BASE_URL } from '../lib/constants'
import { toast } from 'sonner'
import { setUserData } from '../redux/userSlice'

const LeftHome = () => {
  const { userData } = useSelector(state => state.user)
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
      <div className='w-full h-[100px] flex items-center justify-between'>
        <a href='/'><img className='mx-5 mt-13 cursor-pointer w-[200px]' src='/Chugli_trans3.png' alt='Chugli' /></a>
      </div>
      <div className='mx-5 mt-5 flex items-center justify-between '>
        <div className='flex items-center gap-[10px]'>
          <div className='w-[60px] h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
            <img src={userData.profileImage ? userData.profileImage : "/empty_dp.jpg"} className='w-full object-cover' />
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
    </div>
  )
}

export default LeftHome
