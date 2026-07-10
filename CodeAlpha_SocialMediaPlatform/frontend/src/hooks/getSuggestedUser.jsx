import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { API_BASE_URL } from '../lib/constants'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedUsers } from '../redux/userSlice'

const getSuggestedUsers = () => {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/api/user/suggested`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setSuggestedUsers(res.data.users))
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser()
  }, [userData])
}

export default getSuggestedUsers
