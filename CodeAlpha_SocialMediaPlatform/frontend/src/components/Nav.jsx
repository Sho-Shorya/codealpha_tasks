import React, { useState } from 'react'
import { GoHome, GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import { FiPlusSquare } from "react-icons/fi";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, MessageCircleCheck, MessageCircleDashed, MessageCircleIcon, MessageCircleMore, MessageCircleOff, MessageCirclePlus, MessageSquareMore } from 'lucide-react';
import { RiMessage2Fill, RiMessage3Fill, RiMessageFill } from 'react-icons/ri';
import { useLocation } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate()
  const [toggleHome, setToggleHome] = useState(true)
  const { userData, suggestedUsers } = useSelector(state => state.user)
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isSearch = location.pathname === "/search-user";
  const isUpload = location.pathname === "/upload";
  const isProfile = location.pathname === `/profile/${userData?.userName}`;
  return (
    < div className='w-[95%] lg:w-[30%] h-[70px] bg-black/90 flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]' >

      {/* Home */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer hover:bg-gray-800 rounded-full p-4"
      >
        {isHome ? (
          <GoHomeFill className="text-white w-[25px] h-[25px]" />
        ) : (
          <GoHome className="text-white w-[25px] h-[25px]" />
        )}
      </div>

      {/* Search */}
      <div
        onClick={() => navigate("/search-user")}
        className="cursor-pointer hover:bg-gray-800 rounded-full p-4"
      >
        <FiSearch
          className={`w-[25px] h-[25px] ${isSearch ? "text-blue-500" : "text-white"
            }`}
        />
      </div>

      {/* Upload */}
      <div
        onClick={() => navigate("/upload")}
        className="cursor-pointer hover:bg-gray-800 rounded-full p-4"
      >
        <FiPlusSquare
          className={`w-[25px] h-[25px] ${isUpload ? "text-blue-500" : "text-white"
            }`}
        />
      </div>

      {/* Profile */}
      <div
        onClick={() => navigate(`/profile/${userData?.userName}`)}
        className="cursor-pointer hover:bg-gray-800 rounded-full p-2"
      >
        <div
          className={`w-[40px] h-[40px] rounded-full overflow-hidden border-2 ${isProfile ? "border-blue-500" : "border-gray-800"
            }`}
        >
          <img
            src={userData?.profilePic || "/empty_dp.jpg"}
            className="w-full h-full object-cover"
            alt="Profile"
          />
        </div>
      </div>
    </div >
  )
}

export default Nav