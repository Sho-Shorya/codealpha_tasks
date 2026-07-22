import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { API_BASE_URL } from '../lib/constants'
import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { HiDotsHorizontal, HiUserGroup } from "react-icons/hi";
import { toast } from 'sonner'
import { FaHandDots, FaRegHeart } from "react-icons/fa6"
import { useLocation, useNavigate } from "react-router-dom";
import Nav from '../components/Nav'
import Post from '../components/Post'
import FollowBtn from '../components/FollowBtn'
import { Loader } from 'lucide-react'
import { setSelectedUser } from '../redux/messageSlice'

function Profile() {
  const navigate = useNavigate()
  const { userName } = useParams()
  const dispatch = useDispatch()
  const { profileData } = useSelector(state => state.user)
  const { postData } = useSelector((state) => state.posts);
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const userPosts = postData.filter(
    (post) => post?.author?._id === profileData?.user?._id
  );

  // 1. DELETED THE DUPLICATE IMPORT FROM HERE
  const location = useLocation();

  // Grab the position that Page 1 gave us  
  const savedScrollPosition = location.state?.savedScrollPosition || 0;

  const handleGoBackToPageOne = () => {
    // Pass the exact same position back to Page 1 when returning
    navigate('/', {
      state: { returnScrollPosition: savedScrollPosition }
    });
  };

  // Force Page 2 to ALWAYS show its top content when it mounts
  useEffect(() => {
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
  }, []);

  const handleProfile = async () => {
    setLoadingProfile(true)
    try {
      const result = await axios.get(`${API_BASE_URL}/api/user/profile/${userName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(setProfileData(result.data))
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProfile(false)
    }
  }
  useEffect(() => {
    if (!profileData) {
      navigate("/", { replace: true });
    }
    handleProfile()
  }, [navigate, userName, dispatch])
  const { userData, suggestedUsers } = useSelector(state => state.user)

  const handleLogout = async () => {
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
      toast.error(error.response?.data?.message);
    }
  }


  return (
    <div className='w-full min-h-[100vh] bg-black md:flex md:flex-row md:items-start'>
      <div className='md:w-[25%]  flex flex-col items-center  '>
        {/* top nav */}
        <div className='w-full flex justify-between items-center   px-[20px] pt-[20px]'>
          {/* 2. UPDATED TO USE handleGoBackToPageOne INSTEAD OF navigate('/') */}
          <MdOutlineKeyboardBackspace className='text-white cursor-pointer' size={24} onClick={handleGoBackToPageOne} />
          <div className='text-white font-semibold'>{profileData?.user?.userName}</div>
          {userData._id == profileData?.user?._id ? <div className='text-blue-500 text-[15px] cursor-pointer' onClick={() => { setConfirmLogout(true) }}>Log Out</div> : <div><HiDotsHorizontal className='cursor-pointer' /></div>}
        </div>

        {/* profile info */}
        <div className='w-[80px] h-[80px] md:w-[130px] md:h-[130px]  rounded-full overflow-hidden border-2 border-gray-700 mt-[30px]'>
          <img src={profileData?.user?.profilePic || '/empty_dp.jpg'} alt="" className='w-full h-full object-cover' />
        </div>

        <div className='text-white text-[18px] font-semibold mt-[10px]'>{profileData?.user?.userName}</div>
        <div className='text-gray-400 text-[14px]'>{profileData?.user?.profession || "new user"}</div>
        <div className='text-gray-400 text-[14px]'>{profileData?.user?.bio}</div>

        {/* stats */}
        <div className='flex gap-[40px] mt-[20px]'>
          <div className='flex flex-col items-center'>
            <div className='text-white font-semibold text-[16px]'>{profileData?.user?.posts?.length || 0}</div>
            <div className='text-gray-400 text-[13px]'>Posts</div>
          </div>

          <div className='flex flex-col items-center'>
            <div className='flex items-center gap-[4px]'>
              <HiUserGroup className='text-white' size={16} />
              <div className='text-white font-semibold text-[16px]'>{profileData?.user?.followers?.length || 0}</div>
            </div>
            <div className='text-gray-400 text-[13px]'>Followers</div>
          </div>

          <div className='flex flex-col items-center'>
            <div className='flex items-center gap-[4px]'>
              <HiUserGroup className='text-white' size={16} />
              <div className='text-white font-semibold text-[16px]'>{profileData?.user?.following?.length || 0}</div>
            </div>
            <div className='text-gray-400 text-[13px]'>Following</div>
          </div>
        </div>

        {/* edit profile button */}
        <div>
          {profileData?.user?._id == userData?._id && <button
            className='my-[20px] px-[24px] py-[8px] bg-white text-[black] rounded-full font-medium cursor-pointer'
            onClick={() => navigate('/editprofile')}
          >
            Edit Profile
          </button>}

          {profileData?.user?._id != userData?._id &&

            <div className='flex gap-[15px]'>
              <FollowBtn tailwind={'my-[20px] px-[24px] py-[8px] bg-white text-[black] rounded-full font-medium cursor-pointer'} targetUserId={profileData?.user?._id} onFollowChange={handleProfile} />
              <button onClick={() => { dispatch(setSelectedUser(profileData?.user)); navigate('/message-area') }} className='my-[20px] px-[24px] py-[8px] bg-white text-[black] rounded-full font-medium cursor-pointer'>Message</button>
            </div>
          }
        </div>
      </div>


      <div className='md:w-[50%]  min-h-screen flex'>
        <div className='w-full min-h-screen flex justify-center bg-white rounded-t-[60px] md:mt-[0px] sm:mt-[30px] pb-[100px]'>
          <div className=" text-[black] w-full min-h-[100vh] flex flex-col items-center gap-[10px] lg:gap-[20px] p-[20px] lg:pt-[40px] pt-[5px] bg-white rounded-t-[30px] relative pb-[120px]">
            <p className='text-[black] mt-3 lg:m-0'>
              {userPosts?.length === 0 ? (
                "No posts!"
              ) : userPosts?.length === 1 ? (
                <>
                  <span>({userPosts.length})</span> Post
                </>
              ) : (
                <>
                  <span>({userPosts.length})</span> Posts
                </>
              )}
            </p>
            {userPosts?.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
          <Nav />
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
              }}>Yes</button>
            </div>
          </div>
        </div>
      }
      {
        loadingProfile && <div className='fixed inset-0 z-51 flex items-center justify-center bg-black/30'>
        </div>
      }

    </div>
  )
}

export default Profile;
