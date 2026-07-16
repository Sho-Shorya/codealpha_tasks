import uploadToCloudinary from "../config/cloudinary.js";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";

export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body
    let media;
    if (req.file) {
      media = await uploadToCloudinary(req.file.path)
    } else {
      return res.status(400).json({ message: "Media is required" })
    }
    const post = await Post.create({
      caption, media, mediaType, author: req.userId
    })
    const user = await User.findById(req.userId)
    user.posts.push(post._id)
    await user.save()
    const populatedPost = await Post.findById(post._id).populate("author", "name userName profilePic")
    return res.status(200).json(populatedPost)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `upload post error ${error}` })
  }
}

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name userName profilePic")
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Get all posts error: ${error.message}`,
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.userId }).populate("author", "name userName profilePic")
    return res.status(200).json(posts)
  } catch (error) {
    return res.status(500).json({ message: `Get all posts error ${error}` })
  }
}

export const like = async (req, res) => {
  try {
    const postId = req.params.postId
    const post = Post.findById(postId)
    if (post) {
      return res.status(400).json({ message: `post not found` })
    }
    const alreadyLiked = post.likes.some(id => id.ToString() == req.userId.ToString())
    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.ToString() != req.userId.ToString())
    } else {
      post.likes.push(req.userId)
    }

    await post.save()
    post.populate("author", "name userName profilePic")
    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({ message: `like post error ${error}` })
  }
}

export const comment = async (req, res) => {
  try {
    const { message } = req.body
    const postId = req.params.postId
    const post = Post.findById(postId)
    if (post) {
      return res.status(400).json({ message: `post not found` })
    }
    post.comments.push({
      author: req.userId,
      message
    })
    await post.save()
    post.populate("author", "name userName profilePic"),
      post.populate("comments.author")
    return res.status(200).json(post)

  } catch (error) {
    return res.status(500).json({ message: `Comment error ${error}` })
  }
}