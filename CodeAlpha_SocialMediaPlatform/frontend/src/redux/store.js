import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import postSlice from "./postSlice"
import messageSlice from "./messageSlice"
import socketSlice from "./socketSlice"

export const store = configureStore({
  reducer:{
    user:userSlice,
    posts:postSlice,
    message:messageSlice,
    socket:socketSlice
  }
})