import { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/constants";
import { useDispatch } from "react-redux";
import { clearUser, setUserData } from "../redux/userSlice";

const getCurrentUser = () => {
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
        const res = await axios.get(`${API_BASE_URL}/api/user/current`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setUserData(res.data.user));
      } catch (error) {
        console.log(error);

        // Token invalid or expired
        localStorage.removeItem("token");
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default getCurrentUser;