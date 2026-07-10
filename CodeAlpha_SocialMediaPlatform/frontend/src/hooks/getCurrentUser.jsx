import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { API_BASE_URL } from '../lib/constants'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const useGetCurrentUser = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/api/user/current`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setUserData(res.data.user))
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser()
  }, [dispatch])
}

export default useGetCurrentUser
