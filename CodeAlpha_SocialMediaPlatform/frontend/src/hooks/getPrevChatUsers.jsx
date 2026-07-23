import { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUserData } from "../redux/userSlice";
import { setPrevChatUsers } from "../redux/messageSlice";

const getPrevChatUsers = () => {
  const { messages } = useSelector(state => state.message)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      // No token -> clear redux state
      if (!token) {
        dispatch(clearUser());
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/message/prev-chats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        dispatch(setPrevChatUsers(res.data));

      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUser();
  }, [messages]);
};

export default getPrevChatUsers;