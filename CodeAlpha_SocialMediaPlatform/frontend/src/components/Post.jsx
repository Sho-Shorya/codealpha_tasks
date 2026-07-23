import React, { useEffect, useState } from 'react'
import { Heart, MessageCircle, Bookmark, VolumeX, Pencil, Trash2, Copy } from 'lucide-react';
import { Ellipsis } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import { setProfileData, setSuggestedUsers, setUserData } from '../redux/userSlice'
import { setPostData } from '../redux/postSlice'
import { API_BASE_URL } from '../lib/constants.js'
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import FollowBtn from './FollowBtn.jsx';

const Post = ({ post }) => {
  const navigate = useNavigate()
  const { userData } = useSelector(state => state.user);
  const { profileData } = useSelector(state => state.user);
  const { postData } = useSelector(state => state.posts);
  const [expanded, setExpanded] = useState(false);
  const [showComment, setShowComment] = useState(false)
  const [message, setMessage] = useState('')
  const [showPostOptions, setShowPostOptions] = useState(false);
  const dispatch = useDispatch()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { suggestedUser } = useSelector(state => state.user)
  const { socket } = useSelector(state => state.socket)


  const handleLike = async () => {
    const token = localStorage.getItem("token");

    const updatedPosts = postData.map((p) => {
      if (p._id !== post._id) return p;

      const alreadyLiked = p.likes.includes(userData._id);

      return {
        ...p,
        likes: alreadyLiked
          ? p.likes.filter((id) => id !== userData._id)
          : [...p.likes, userData._id],
      };
    });

    dispatch(setPostData(updatedPosts));

    try {
      await axios.get(`${API_BASE_URL}/api/post/like/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      // Rollback if API fails
      dispatch(setPostData(postData));
      toast.error('error')
      console.log(err);
    }
  };
  const handleComment = async () => {
    const token = localStorage.getItem("token");

    // Temporary comment
    const tempComment = {
      _id: Date.now().toString(), // temporary id
      author: userData,
      message,
    };

    // Optimistic update
    const updatedPosts = postData.map((p) => {
      if (p._id !== post._id) return p;

      return {
        ...p,
        comments: [...p.comments, tempComment],
      };
    });

    dispatch(setPostData(updatedPosts));
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/post/comment/${post._id}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Replace optimistic comment with actual backend data
      const latestPosts = postData.map((p) =>
        p._id === post._id ? res.data : p
      );

      dispatch(setPostData(latestPosts));
    } catch (error) {
      console.log(error);
      toast.error('Sorry, server is facing some issue, Please try again after sometime.')
      // Rollback if request fails
      dispatch(setPostData(postData));
    }
  };
  const deleteComment = async (postId, commentId) => {
    const token = localStorage.getItem("token");

    // Save previous state for rollback
    const previousPosts = postData;

    // Optimistically remove the comment
    const updatedPosts = postData.map((p) => {
      if (p._id !== postId) return p;

      return {
        ...p,
        comments: p.comments.filter(
          (comment) => comment._id !== commentId
        ),
      };
    });

    dispatch(setPostData(updatedPosts));

    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/post/comment/${postId}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message, { duration: 1000 });

      // Optional:
      // If backend returns the updated post and you trust it more,
      // you can replace the optimistic version:
      //
      // const serverUpdatedPosts = updatedPosts.map((p) =>
      //   p._id === postId ? res.data.post : p
      // );
      // dispatch(setPostData(serverUpdatedPosts));

    } catch (error) {
      // Rollback
      dispatch(setPostData(previousPosts));
      toast.error("Failed to delete comment");
      console.error(error);
    }
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

        const updatedUser = {
          ...userData,
          posts: userData.posts.filter(
            (id) => id !== postId
          )
        };

        const updatedProfile = {
          ...profileData,
          user: {
            ...profileData.user,
            posts: profileData?.user?.posts.filter(id => id !== postId),
          },
        };

        dispatch(setUserData(updatedUser));
        dispatch(setProfileData(updatedProfile));

        toast.success(res.data.message, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  // ,,,
  // 
  const handleCopy = async () => {
    try {
      const postId = post?._id;

      // Safety check to ensure the ID exists before attempting to copy
      if (!postId) {
        toast.error('Post ID not found.');
        return;
      }

      // Directly build the string instead of mapping through an array
      const postLinkToCopy = `Abhi ye nahin bnaya yaar`;

      await navigator.clipboard.writeText(postLinkToCopy);
      toast.success('Link copied to clipboard!', { duration: 1000 });
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy link.');
    }
  };

  const handleProfileVisitFromPost = async () => {
    if (postData.map((p) => { p._id == post._id })) {
      // console.log("yes");
      const username = post.author.userName
      navigate(`/profile/${username}`)
    } else { return }


    // navigate(`/profile/${userData.userName}`)
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("socketLikedPost", (updatedData) => {
      const socketUpdatedPosts = postData.map((p) =>
        p._id === updatedData.postId
          ? { ...p, likes: updatedData.likes }
          : p
      );

      dispatch(setPostData(socketUpdatedPosts));
    });

    socket.on("socketCommentedPost", (updatedData) => {
      const socketUpdatedPosts = postData.map((p) =>
        p._id === updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p
      );

      dispatch(setPostData(socketUpdatedPosts));
    });

    return () => {
      socket.off("socketLikedPost");
      socket.off("socketCommentedPost");
    };
  }, [socket, postData, dispatch]);
  
  return (
    <div className="w-[100%] lg:w-[70%] min-h-[300px] flex flex-col gap-[10px] bg-white items-center shadow-1xl shadow-[#00000058] rounded-2xl">
      {/* Outer Card Container */}
      <div className="w-[103%] h-full bg-white rounded-2xl p-1 shadow-sm border border-gray-100">

        {/* Header Section */}
        <div onClick={(e) => { setShowComment(false) }} className="flex items-center justify-between mb-4 p-2 pb-0">
          <div onClick={handleProfileVisitFromPost} className=" cursor-pointer flex items-center gap-3">
            {/* Profile Image Placeholder */}
            <div className="border-white hover:border-1 transition-ease-in duration-[200ms] w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <img
                src={post?.author?.profilePic || '../empty_dp.jpg'}
                alt="Profile"
                className=" w-full h-full object-cover"
              />
            </div>
            <span className="hover:underline underline-offset-1 font-semibold text-sm text-gray-900">{post?.author?.userName}</span>
          </div>
          <div className='flex flex-row items-center lg:gap-[15px] gap-[10px]'>
            {post?.author?._id !== userData._id && (
              <FollowBtn tailwind={'bg-black text-white text-xs cursor-pointer font-semibold px-5 py-2 rounded-full hover:bg-gray-800 transition'} targetUserId={post?.author?._id} />
            )}
            <Ellipsis
              className="cursor-pointer"
              onClick={() => setShowPostOptions(true)}
            />
          </div>
        </div>

        {/* Media Content Area */}
        <div onClick={(e) => { setShowComment(false) }} className="relative flex justify-center rounded-2xl overflow-hidden mb-4  bg-[#0a0505]">
          <img className='lg:max-h-[400px] max-h-[500px] object-stretch' src={post?.media || './empty_dp.jpg'} />
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center justify-between mx-2 mb-4">
          <div className="flex items-center gap-4 text-gray-700">
            <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-red-500 transition">
              {!post?.likes?.includes(userData._id) && <FaRegHeart className='w-[20px] h-[20px] cursor-pointer' />}
              {post?.likes?.includes(userData._id) && <FaHeart className='w-[20px] h-[20px] cursor-pointer' color='red' />}
              <span className="text-xs font-medium">{post?.likes?.length}</span>
            </button>
            <button onClick={() => { setShowComment(!showComment) }} className="flex items-center gap-1.5 hover:text-blue-500 transition">
              <MessageCircle className=" className='w-[20px] h-[20px] cursor-pointer" />
              <span className="text-xs font-medium">{post?.comments?.length}</span>
            </button>
          </div>
        </div>


        {/* Caption Section */}
        <div className="text-sm p-2 pt-0">
          <span className="font-semibold text-gray-900 mr-2">
            {post?.author?.userName}
          </span>

          <span className="text-gray-600 break-words">
            {expanded
              ? post?.caption
              : post?.caption.slice(0, 40)}

            {post?.caption?.length > 40 && (
              <span
                onClick={() => setExpanded(!expanded)}
                className="text-gray-400 cursor-pointer ml-1"
              >
                {expanded ? " Show less" : "...more"}
              </span>
            )}
          </span>
        </div>
        {showComment && (
          <div>
            <div className="w-full flex items-center gap-3 px-3 py-2 border-t border-gray-200 bg-white">
              {/* Profile */}
              <img
                src={userData.profilePic || '../empty_dp.jpg'}
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
                        src={com.author?.profilePic || '../empty_dp.jpg'}
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
                  onClick={() => navigate(`/editpost/${post._id}`)}
                  className="w-full px-5 py-4 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition"
                >
                  <Pencil className='h-5 w-5' />
                  <span>Edit Post</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    setConfirmDelete(true);
                  }}
                  className="w-full px-5 py-4 flex items-center gap-3 text-red-600 hover:bg-red-50  cursor-pointer transition"
                >
                  <Trash2 className='h-5 w-5' />
                  <span>Delete Post</span>
                </button>

              </>
            ) : (
              <>

                {/* Copy Link */}
                <button
                  onClick={handleCopy}
                  className="w-full px-5 py-4 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition"
                >
                  <Copy className='h-5 w-5' />
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
      {
        confirmDelete && <div className='fixed inset-0 z-51 flex items-center justify-center bg-black/60'>
          <div className='bg-white rounded-[10px] flex flex-col  justify-center items-center gap-[20px] md:w-[30%]  h-[20%] w-[80%]'>
            <p className=' text-1.3xl font-semibold'>Confirm delete Post?</p>
            <div className='flex items-center justify-center  gap-[30px] text-1xl'>
              <button onClick={() => { setConfirmDelete(false) }} className='bg-gray-200 px-4 py-2 hover:bg-gray-100 cursor-pointer duration-[100ms] rounded-[10px]'>No</button>
              <button className='hover:bg-red-600 bg-red-600 text-white lg:text-black lg:bg-white hover:text-white cursor-pointer duration-[100ms]  px-4 py-2 rounded-[10px]' onClick={() => {
                deletePost(post._id);
                setShowPostOptions(false);
                setConfirmDelete(false)
              }}>Yes</button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Post