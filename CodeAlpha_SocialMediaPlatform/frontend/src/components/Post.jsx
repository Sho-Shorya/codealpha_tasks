import React from 'react'
import { Heart, MessageCircle, Bookmark, VolumeX } from 'lucide-react';

const Post = ({ postData }) => {
  return (

    <div className="w-[95%] lg:w-[70%] min-h-[300px] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl
">
      {/* Outer Card Container */}
      <div className="w-full h-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Profile Image Placeholder */}
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={postData.author?.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-sm text-gray-900">{postData.author.userName}</span>
          </div>
          <button className="bg-black text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-gray-800 transition">
            Follow
          </button>
        </div>

        {/* Media Content Area */}
        <div className="relative flex justify-center rounded-2xl overflow-hidden mb-4  bg-[#0a0505]">
          <img className='max-h-[400px] object-stretch' src={postData.media || '../empty_dp.jpg'}/>
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-gray-700">
            <button className="flex items-center gap-1.5 hover:text-red-500 transition">
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              <span className="text-xs font-medium">{postData.likes.length}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-500 transition">
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs font-medium">{postData.comments.length}</span>
            </button>
          </div>
          <button className="text-gray-700 hover:text-black transition">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Caption Section */}
        <div className="text-sm">
          <span className="font-semibold text-gray-900 mr-2">{postData.author.userName}</span>
          <span className="text-gray-600">{postData.caption}</span>
        </div>

      </div>
    </div>
  )
}

export default Post