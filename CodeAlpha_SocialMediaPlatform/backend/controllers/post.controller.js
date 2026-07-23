import uploadToCloudinary from "../config/cloudinary.js";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { io } from "../socket.js";

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
      .populate("comments.author", "userName profilePic")
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
    const selectedPost = await Post.findById(postId)

    if (!selectedPost) {
      return res.status(400).json({ message: `Post not found` })
    }
    const alreadyLiked = selectedPost.likes.some(id => id.toString() == req.userId.toString())
    if (alreadyLiked) {
      selectedPost.likes = selectedPost.likes.filter(id => id.toString() != req.userId.toString())
    } else {
      selectedPost.likes.push(req.userId)
    }
    await selectedPost.save()
    await selectedPost.populate("author", "name userName profilePic")
    io.emit('socketLikedPost', {
      postId: selectedPost._id,
      like: selectedPost.likes
    })
    return res.status(200).json(selectedPost)
  } catch (error) {
    return res.status(500).json({ message: `like post error ${error}` })
  }
}

export const comment = async (req, res) => {
  try {
    const { message } = req.body
    const postId = req.params.postId
    const commentedPost = await Post.findById(postId)
    if (!commentedPost) {
      return res.status(400).json({ message: `Post not found` })
    }
    commentedPost.comments.push({
      author: req.userId,
      message
    })
    await commentedPost.save()
    await commentedPost.populate("author", "name userName profilePic");
    await commentedPost.populate("comments.author", "name userName profilePic");
    io.emit('socketCommentedPost', {
      postId: commentedPost._id,
      comments: commentedPost.comments
    })

    return res.status(200).json(commentedPost)

  } catch (error) {
    return res.status(500).json({ message: `Comment error ${error}` })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const commentUpdatedPost = await Post.findById(postId);

    if (!commentUpdatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = commentUpdatedPost.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Only the comment owner can delete
    if (comment.author._id.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    comment.deleteOne(); // or comment.remove() for older Mongoose versions

    await commentUpdatedPost.save();

    await commentUpdatedPost.populate("author", "name userName profilePic");
    await commentUpdatedPost.populate("comments.author", "name userName profilePic");

    return res.status(200).json({
      success: true,
      message: "Comment deleted.",
      commentUpdatedPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check ownership
    if (post.author?._id.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post.",
      });
    }

    await User.findByIdAndUpdate(post.author, {
      $pull: { posts: post._id }
    });

    await Post.findByIdAndDelete(postId);
    io.emit("socketCommentedPost", {
      postId: commentUpdatedPost._id,
      comments: commentUpdatedPost.comments
    });
    return res.status(200).json({
      success: true,
      message: "Post deleted.",
      postId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { caption } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    post.caption = caption;

    if (req.file) {
      const media = await uploadToCloudinary(req.file.path);
      post.media = media;
    }

    await post.save();

    res.json({
      success: true,
      post,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};