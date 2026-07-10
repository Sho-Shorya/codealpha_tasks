import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, },
  profilePic: { type: String, default: "" }, //Clouduinary image url
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],

  saved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  bio: { type: String, default: '' },
  gender: { type: String, default: '' },
  profession: { type: String, default: '' },
  country: { type: String, default: '' },
  isLoggedIn: { type: Boolean, default: false },
  token: { type: String, default: null }
}, { timestamps: true }) //gives timeStamps for "Created at" and "updated at"

export const User = mongoose.model("User", userSchema)