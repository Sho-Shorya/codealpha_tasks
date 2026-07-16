import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { API_BASE_URL } from '../lib/constants'
import { toast } from 'sonner'
import { setUserData } from '../redux/userSlice'
import OtherUser from './OtherUser'
import { FaRegHeart } from "react-icons/fa6"

const RightHome = () => {
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
    <div className='lg:w-[25%] hidden lg:block min-h-[100vh] bg-[black] border-r-2 border-gray-900'>
      
    </div>
  )
}

export default RightHome
