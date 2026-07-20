import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    suggestedUsers: null,
    profileData:null,
    following:[]
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
    },
  }
})

export const { setUserData, setSuggestedUsers, setProfileData } = userSlice.actions
export default userSlice.reducer