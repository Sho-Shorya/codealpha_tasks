import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { API_BASE_URL } from '../lib/constants'
import { useDispatch } from 'react-redux'
import { setPostData } from '../redux/postSlice'

const getAllPost = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/api/post/getall`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setPostData(res?.data))
      } catch (error) {
        console.log(error)
      }
    }
    fetchPost ()
  }, [dispatch])
}

export default getAllPost
