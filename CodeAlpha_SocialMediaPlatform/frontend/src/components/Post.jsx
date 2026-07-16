import React, { useState } from 'react'
import { Heart, MessageCircle, Bookmark, VolumeX } from 'lucide-react';
import { Ellipsis } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { setUserData } from '../redux/userSlice'
import { setPostData } from '../redux/postSlice'
import { API_BASE_URL } from '../lib/constants.js'
import { RiDeleteBin6Line } from "react-icons/ri";

import { IoClose } from "react-icons/io5";
import { toast } from 'sonner'
import axios from 'axios'

const Post = ({ post }) => {
  const { userData } = useSelector(state => state.user);
  const { postData } = useSelector(state => state.posts);
  const [expanded, setExpanded] = useState(false);
  const [showComment, setShowComment] = useState(false)
  const [message, setMessage] = useState('')
  const [showPostOptions, setShowPostOptions] = useState(false);
  const dispatch = useDispatch()

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API_BASE_URL}/api/post/like/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const updatedPost = res.data
      const updatedPosts = postData.map(p => p._id == post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
  const handleComment = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${API_BASE_URL}/api/post/comment/${post._id}`, { message: message }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const updatedPost = res.data
      const updatedPosts = postData.map(p => p._id == post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))
      setMessage('')
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
  const deleteComment = async (postId, commentId) => {
    const token = localStorage.getItem("token");

    const res = await axios.delete(`${API_BASE_URL}/api/post/comment/${postId}/${commentId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    );
    const commentUpdatedPost = res.data.post
    const commentUpdatedPosts = postData.map(p => p._id == post._id ? commentUpdatedPost : p)
    console.log("postData:", postData);
    console.log("updatedPost:", res.data.commentUpdatedPost);
    const updatedPosts = postData.map((post) =>
      post._id === res.data.commentUpdatedPost._id
        ? res.data.commentUpdatedPost
        : post
    );

    dispatch(setPostData(updatedPosts));
    // dispatch(setPostData(commmentUpdatedPost))
    toast.success(res.data.message)
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `${API_BASE_URL}/api/post/delete/${postId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(
          setPostData(
            postData.filter((post) => post._id !== postId)
          )
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-[100%] lg:w-[70%] min-h-[300px] flex flex-col gap-[10px] bg-white items-center shadow-1xl shadow-[#00000058] rounded-2xl">
      {/* Outer Card Container */}
      <div className="w-[103%] h-full bg-white rounded-2xl p-1 shadow-sm border border-gray-100">

        {/* Header Section */}
        <div onClick={(e) => { setShowComment(false) }} className="flex items-center justify-between mb-4 p-2 pb-0">
          <div className="flex items-center gap-3">
            {/* Profile Image Placeholder */}
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={post.author?.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-sm text-gray-900">{post.author.userName}</span>
          </div>
          <div className='flex flex-row items-center lg:gap-[15px] gap-[10px]'>
            {post.author._id !== userData._id && (
              <button className="bg-black text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-gray-800 transition">
                Follow
              </button>
            )}
            <Ellipsis
              className="cursor-pointer"
              onClick={() => setShowPostOptions(true)}
            />
          </div>
        </div>

        {/* Media Content Area */}
        <div onClick={(e) => { setShowComment(false) }} className="relative flex justify-center rounded-2xl overflow-hidden mb-4  bg-[#0a0505]">
          <img className='lg:max-h-[400px] max-h-[500px] object-stretch' src={post.media || '../empty_dp.jpg'} />
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center justify-between mx-2 mb-4">
          <div className="flex items-center gap-4 text-gray-700">
            <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-red-500 transition">
              {!post.likes.includes(userData._id) && <FaRegHeart className='w-[20px] h-[20px] cursor-pointer' />}
              {post.likes.includes(userData._id) && <FaHeart className='w-[20px] h-[20px] cursor-pointer' color='red' />}
              <span className="text-xs font-medium">{post.likes.length}</span>
            </button>
            <button onClick={() => { setShowComment(!showComment) }} className="flex items-center gap-1.5 hover:text-blue-500 transition">
              <MessageCircle className=" className='w-[20px] h-[20px] cursor-pointer" />
              <span className="text-xs font-medium">{post.comments.length}</span>
            </button>
          </div>
        </div>


        {/* Caption Section */}
        <div className="text-sm p-2 pt-0">
          <span className="font-semibold text-gray-900 mr-2">{post.author.userName}</span>
          <span className="text-gray-600">
            {expanded
              ? post.caption
              : post.caption.slice(0, 40)}

            {post.caption.length > 40 && (
              <span
                onClick={() => setExpanded(!expanded)}
                className="text-gray-400 cursor-pointer ml-1"
              >
                {expanded ? "Show less" : "...more"}
              </span>
            )}
          </span>
        </div>

        {showComment && (
          <div>
            <div className="w-full flex items-center gap-3 px-3 py-2 border-t border-gray-200 bg-white">
              {/* Profile */}
              <img
                src={userData.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border"
              />

              {/* Input */}
              <div className="flex-1">
                <input
                  type="text"
                  value={message}
                  maxLength={200}
                  placeholder="Write a comment..."
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none
        focus:ring-2 focus:ring-blue-500 transition"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && message.trim()) {
                      e.preventDefault(); // Prevents form submission or newline
                      handleComment();
                    }
                  }}
                />
              </div>

              {/* Send Button */}
              <button
                disabled={!message.trim()} onClick={handleComment}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition
      ${message.trim()
                    ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <IoIosSend size={20} />
              </button>
            </div>
            <div className='ml-2 mt-2 w-full max-h-[300px] overflow-auto flex flex-col gap-[10px]'>
              {post.comments?.map((com, index) => (
                <div className='w-[95%] flex items-center justify-between py-2 px-2 border-2 border-gray-300 rounded-full ' key={index}>
                  <div className='flex items-center gap-[10px]'>
                    <div className="w-[40px] h-[40px] md:w-[40px] md:h-[40px] border-1 border-black rounded-full cursor-pointer overflow-hidden">
                      <img
                        src={com.author?.profilePic || './empty_dp.jpg'}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border"
                      />
                    </div>
                    <div className=''>
                      <div className='text-gray-700 text-[12px]'>{com?.author?.userName}</div>
                      <div>{com?.message}</div>
                    </div>
                  </div>
                  {com.author._id === userData._id && (
                    <RiDeleteBin6Line
                      className="cursor-pointer w-10 h-5 text-red-600"
                      onClick={() => deleteComment(post._id, com._id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>


        )}

      </div>
      {showPostOptions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowPostOptions(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_.2s_ease]"
          >
            <div className="py-4 text-center font-semibold border-b border-gray-300 ">
              Post Options
            </div>
            {post.author._id === userData._id ? (
              <>
                {/* Edit */}
                <button
                  className="w-full px-5 py-4 flex items-center gap-3 hover:bg-gray-100  cursor-pointer transition"
                >
                  ✏️
                  <span>Edit Post</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    deletePost(post._id);
                    setShowPostOptions(false);
                  }}
                  className="w-full px-5 py-4 flex items-center gap-3 text-red-600 hover:bg-red-50  cursor-pointer transition"
                >
                  🗑️
                  <span>Delete Post</span>
                </button>

              </>
            ) : (
              <>

                {/* Copy Link */}
                <button
                  className="w-full px-5 py-4 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition"
                >
                  🔗
                  <span>Copy Link</span>
                </button>

              </>
            )}

            {/* Cancel */}
            <button
              onClick={() => setShowPostOptions(false)}
              className="w-full py-4 font-semibold border-t border-gray-300 hover:bg-gray-100  cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Post