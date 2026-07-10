import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    }
  }
})

export const {setUserData}=userSlice.actions
export default userSlice.reducer