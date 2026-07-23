import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '../lib/constants';
import { setUserData } from "../redux/userSlice";

const FollowBtn = ({ targetUserId, tailwind, onFollowChange }) => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  // Check by _id instead of includes()
  const isFollowing = userData?.following?.some(
    (user) => user._id === targetUserId
  );

  const handleFollow = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/user/follow/${targetUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onFollowChange) onFollowChange();

      // ⭐ Best way:
      // Backend should send the updated logged-in user.
      dispatch(setUserData(res.data.user));

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button onClick={handleFollow} className={tailwind}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowBtn;