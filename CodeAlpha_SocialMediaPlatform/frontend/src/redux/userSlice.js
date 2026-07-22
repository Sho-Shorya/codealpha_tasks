import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    suggestedUsers: null,
    profileData: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload
    }, clearUser: (state) => {
      state.userData = null;
    },
  }
})

export const { setUserData, setSuggestedUsers, setProfileData ,clearUser} = userSlice.actions
export default userSlice.reducer