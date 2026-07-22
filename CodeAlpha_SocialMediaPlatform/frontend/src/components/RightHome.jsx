import React from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Nav from './Nav';
import Messages from '../pages/Messages';

const RightHome = () => {
  return (
    <div className=' lg:w-[25%] lg:block hidden min-h-[100vh] bg-[black] border-r-2 border-gray-900'>
      <Messages/>
    </div>
  )
}

export default RightHome