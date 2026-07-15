import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import { FiPlusSquare } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Nav = () => {
  const navigate = useNavigate()
  const { userData, suggestedUsers } = useSelector(state => state.user)
  return (
    < div className='w-[90%] lg:w-[30%] h-[70px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]' >

      <div onClick={() => navigate('/')} className='cursor-pointer hover:bg-gray-800 rounded-full p-4'><GoHomeFill className='text-white w-[25px] h-[25px] cursor-pointer' /></div>

      <div className='cursor-pointer hover:bg-gray-800 rounded-full p-4'><FiSearch className='text-white w-[25px] h-[25px] cursor-pointer' /></div>

      <div onClick={() => navigate('/upload')} className='cursor-pointer hover:bg-gray-800 rounded-full p-4' ><FiPlusSquare className='text-white w-[25px] h-[25px] cursor-pointer ' /></div>
      
      <div onClick={() => { navigate(`/profile/${userData.userName}`) }} className='cursor-pointer hover:bg-gray-800 rounded-full p-2'>
      <div  className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
        <img src={userData.profilePic || "/empty_dp.jpg"} className='w-full h-full object-cover' />
      </div></div>
    </div >
  )
}

export default Nav