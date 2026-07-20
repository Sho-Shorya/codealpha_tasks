import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { API_BASE_URL } from '../lib/constants'
import { setProfileData, setUserData } from "../redux/userSlice";

const FollowBtn = ({ targetUserId, tailwind, onFollowChange }) => {
  const { profileData, userData } = useSelector(
    (state) => state.user
  );

  const isFollowing = userData?.following?.includes(targetUserId);
  const dispatch = useDispatch()
  const handleFollow = async () => {

    const token = localStorage.getItem('token')
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/follow/${targetUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (onFollowChange) {
        onFollowChange()
      }
      const updatedUser = {
        ...userData,
        following: isFollowing
          ? userData.following.filter(id => id !== targetUserId)
          : [...userData.following, targetUserId]
      };

      dispatch(setUserData(updatedUser));
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