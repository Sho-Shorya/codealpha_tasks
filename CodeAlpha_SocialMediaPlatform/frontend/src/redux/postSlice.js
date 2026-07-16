import { createSlice } from "@reduxjs/toolkit";


const postSlice = createSlice({
  name: "posts",
  initialState: {
    postData: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('posts') || 'null') : null
  },
  reducers: {
    setPostData: (state, action) => {
      state.postData = action.payload
    }
  }
})

export const { setPostData } = postSlice.actions
export default postSlice.reducer