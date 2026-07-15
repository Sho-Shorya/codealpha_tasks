import mongoose, { mongo } from "mongoose";

const postSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  media: {
    type: String,
    required: true
  },
  caption: {
    type: String
  },
  likes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message:{
      type:String
    }
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true })

export const Post = mongoose.model('Post', postSchema);