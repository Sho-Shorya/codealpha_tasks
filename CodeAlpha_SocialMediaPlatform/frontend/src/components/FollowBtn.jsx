import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { API_BASE_URL } from '../lib/constants'
import { toggleFollow } from '../redux/userSlice'
import { setProfileData } from "../redux/userSlice";

const FollowBtn = ({ targetUserId, tailwind }) => {
  const { following, profileData, userData } = useSelector(
    (state) => state.user
  );
  const isFollowing = following.includes(targetUserId)
  const dispatch = useDispatch()
  const handleFollow = async () => {

    const token = localStorage.getItem('token')
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/follow/${targetUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      dispatch(toggleFollow(targetUserId))
      dispatch(setProfileData({
        ...profileData,
        user: {
          ...profileData.user,
          followers: isFollowing
            ? profileData.user.followers.filter(id => id !== userData._id)
            : [...profileData.user.followers, userData._id]
        }
      }));
    } catch (error) {
      console.log(error);

    }
  }
  return (
    <button onClick={handleFollow} className={tailwind}>
      {isFollowing ? "Following" : "follow"}
    </button>
  )
}

export default FollowBtn