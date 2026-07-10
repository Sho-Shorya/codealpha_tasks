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
      <div><GoHomeFill className='text-white w-[25px] h-[25px] cursor-pointer' /></div>
      <div><FiSearch className='text-white w-[25px] h-[25px] cursor-pointer' /></div>
      <div><FiPlusSquare className='text-white w-[25px] h-[25px] cursor-pointer' /></div>
      <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
        <img onClick={()=>{navigate(`/profile/${userData.userName}`)}} src={userData.profileImage ? userData.profileImage : "/empty_dp.jpg"} className='w-full object-cover' />
      </div>
    </div >
  )
}

export default Nav