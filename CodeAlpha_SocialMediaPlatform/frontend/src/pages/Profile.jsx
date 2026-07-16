import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { API_BASE_URL } from '../lib/constants'
import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { toast } from 'sonner'
import { FaRegHeart } from "react-icons/fa6"
import { useLocation, useNavigate } from "react-router-dom";
import Nav from '../components/Nav'
import Post from '../components/Post'

function Profile() {
  const navigate = useNavigate()
  const { userName } = useParams()
  const dispatch = useDispatch()
  const { profileData } = useSelector(state => state.user)
  const { postData } = useSelector(state => state.user)

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
    try {
      const result = await axios.get(`${API_BASE_URL}/api/user/profile/${userName}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(setProfileData(result.data))
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    handleProfile()
  }, [userName, dispatch])

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

      toast.success("Logged out successfully")
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  const handleFollow = async () => {
    console.log("followed")
  }
  return (
    <div className='w-full min-h-[100vh] bg-black md:flex md:flex-row md:items-start relative'>
      <div className='md:w-[25%] flex flex-col items-center'>
        {/* top nav */}
        <div className='w-full flex justify-between items-center   px-[20px] pt-[20px]'>
          {/* 2. UPDATED TO USE handleGoBackToPageOne INSTEAD OF navigate('/') */}
          <MdOutlineKeyboardBackspace className='text-white cursor-pointer' size={24} onClick={handleGoBackToPageOne} />
          <div className='text-white font-semibold'>{profileData?.user?.userName}</div>
          <div className='text-blue-500 cursor-pointer' onClick={handleLogout}>Log Out</div>
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

          {profileData?.user?._id != userData?._id && <button
            className='mt-[20px] px-[24px] py-[8px] bg-white text-[black] rounded-full font-medium cursor-pointer'
            onClick={handleFollow}
          >
            Follow
          </button>}
        </div>
      </div>

      {/* posts section */}
      <div className='md:w-[50%] min-h-screen flex'>
        <div className='w-full min-h-screen flex justify-center bg-white rounded-t-[60px] md:mt-[0px] sm:mt-[30px] pb-[100px]'>
          <div className='w-full h-[100px] flex items-center justify-between lg:hidden'>
            <a href='/'><img className='mt-8 ml-4 cursor-pointer w-[200px]' src='/Chugli_trans3.png' alt='Chugli' /></a>
            <a href='/'><FaRegHeart className='mt-1 mr-6 text-white h-[25px] w-[25px]' /></a>
          </div>
          <div className="w-full min-h-[100vh] flex flex-col items-center gap-[10px] lg:gap-[20px] p-[10px] lg:pt-[40px] pt-[5px] bg-white rounded-t-[30px] relative pb-[120px]">
            {postData?.map((post, index) => (
              <Post postData={post} key={index} />
            ))}
          </div>
          <Nav />
        </div>
      </div>
    </div>
  )
}

export default Profile;
