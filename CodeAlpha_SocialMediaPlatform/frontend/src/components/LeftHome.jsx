import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { API_BASE_URL } from '../lib/constants'
import { toast } from 'sonner'
import { setUserData } from '../redux/userSlice'
import OtherUser from './OtherUser'
import { FaRegHeart, FaS } from "react-icons/fa6"
import { Loader, Loader2 } from 'lucide-react'

const LeftHome = () => {
  const { userData, suggestedUsers } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [loading, setLoading] = useState(false)


  const handleLogout = async () => {
    setLoading(true);
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
      toast.success("Logged out!", { duration: 1000 })
    } catch (error) {
      toast.error(error.response?.data?.message, { duration: 1000 });
    } finally {
      setLoading(false)
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
        <div onClick={() => { setConfirmLogout(true) }} className='text-blue-500 font-semibold cursor-pointer'>
          logout
        </div>
      </div>
      <div className='w-full flex flex-col gap-[20px] p-[20px]'>
        <h1 className='text-[15px] ml-1'>Suggested Users</h1>
        <div className=''>
          {suggestedUsers && suggestedUsers.slice(0, 5).map((user, index) => (
            <OtherUser key={index} user={user} />
          ))}
        </div>

      </div>
      {
        confirmLogout && <div className='fixed inset-0 z-51 flex items-center justify-center bg-black/60'>
          <div className='text-[black] bg-white rounded-[10px] flex flex-col  justify-center items-center gap-[20px] md:w-[30%]  h-[20%] w-[80%]'>
            <p className=' text-1.3xl  font-semibold'>Confirm Logout?</p>
            <div className='flex items-center justify-center  gap-[30px] text-1xl'>
              <button onClick={() => { setConfirmLogout(false) }} className='bg-gray-200 px-4 py-2 hover:bg-gray-100 cursor-pointer duration-[100ms] rounded-[10px]'>No</button>
              <button className='hover:bg-red-600 bg-red-600 text-white lg:text-black lg:bg-white hover:text-white cursor-pointer duration-[100ms]  px-4 py-2 rounded-[10px]' onClick={() => {
                handleLogout();
                setConfirmLogout(false)
              }}>{loading ? <Loader2 className="h-5 p-0 m-0 w-5 animate-spin" /> : "Yes"}</button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default LeftHome
