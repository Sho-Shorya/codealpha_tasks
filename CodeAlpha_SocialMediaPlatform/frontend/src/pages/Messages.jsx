import React from 'react'
import Nav from '../components/Nav'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const Messages = () => {
  const navigate = useNavigate()
  return (
    <div className='bg-[black] text-white w-full h-full  px-[20px] pt-[20px]'>
      <div className='w-full flex justify-start gap-[20px] items-center'>
        <MdOutlineKeyboardBackspace className='text-white lg:hidden' size={24} onClick={() => navigate(`/`)} />
        <h1 className='font-semibold p-2'>Messages</h1>
      </div>
      <div className='w-full justify-content'>
        
      </div>
    </div>
  )
}

export default Messages