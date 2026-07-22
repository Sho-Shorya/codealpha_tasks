
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from './Nav'
import { HiDotsHorizontal } from 'react-icons/hi'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import OtherUser from './OtherUser'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { API_BASE_URL } from '../lib/constants'
import { useEffect } from 'react'
import axios from 'axios'

const SearchUser = () => {
  const [searchedUser, setSearchedUser] = useState('')
  const [results, setResults] = useState([]);
  const { suggestedUsers } = useSelector(state => state.user)
  const navigate = useNavigate()
  const searchUsers = async () => {
    try {
      if (!searchedUser.trim()) {
        setResults([]);
        return;
      }

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE_URL}/api/user/search?query=${searchedUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers();
    }, 0); // waits 400ms after typing

    return () => clearTimeout(timer);
  }, [searchedUser]);
  return (
    <div className='w-full h-auto flex flex-col pt-2 bg-[black] text-white'>
      <div className='w-full h-[30px] flex justify-between items-center   px-[20px] pt-[20px]'>
        <MdOutlineKeyboardBackspace onClick={() => navigate('/')} className='text-white cursor-pointer' size={24} />
        <div className='text-white font-semibold'>Search</div>
        <div><HiDotsHorizontal className='cursor-pointer' /></div>
      </div>
      <div className="w-full flex justify-center mt-8 pb-[200px]">
        <div className="w-full max-w-2xl px-4">
          <input
            value={searchedUser}
            onChange={(e) => setSearchedUser(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="w-full h-12 px-5 rounded-xl bg-white text-black outline-none"
          />

          <div className="mt-8 h-screen">
            <h2 className="text-center text-gray-400 text-xl mb-6">
              {searchedUser ? "Results" : "Suggested Users"}
            </h2>

            <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden">
              {!searchedUser
                ? suggestedUsers?.slice(0, 6).map((user) => (
                  <OtherUser
                    key={user._id}
                    user={user}
                    tailwind="px-5 py-4 border-b border-gray-800 last:border-b-0 flex justify-between items-center"
                  />
                ))
                : (
                  results.map(user => (
                    <OtherUser key={user._id} user={user}
                      tailwind="px-5 py-4 border-b border-gray-800 last:border-b-0 flex justify-between items-center" />
                  ))
                )}
              {searchedUser && results.length === 0 && (
                <p className="text-center flex justify-center h- items-center text-gray-400 m-10">
                  No users found
                </p>
              )}
            </div>
          </div>
        </div>

        <Nav />
      </div>
    </div>
  )
}

export default SearchUser