import { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";

export const fetchPosts = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(`${API_BASE_URL}/api/post/getall`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setPostData(res.data));
  } catch (error) {
    console.log(error);
  }
};

const useGetAllPosts = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state=>state.user)
  useEffect(() => {
    fetchPosts(dispatch);
  }, [dispatch,userData]);
};

export default useGetAllPosts;