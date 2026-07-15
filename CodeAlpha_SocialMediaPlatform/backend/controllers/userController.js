import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../config/token.js"
import uploadToCloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
  try {
    //extracting details from frontend
    const { name, userName, email, password } = req.body;
    if (!name || !userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least six (6) characters"
      })
    }

    //check if user already exists
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists!"
      })
    }
    //check if userName already exists
    const findByUserName = await User.findOne({ userName })
    if (findByUserName) {
      return res.status(400).json({
        success: false,
        message: "UserName already exists!"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    //creating User
    const newUser = await User.create({
      name,
      userName,
      email,
      password: hashedPassword
    })
    await newUser.save()

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    }) //internal server error

  }
}
export const login = async (req, res) => {
  try {
    const { userName, password } = req.body
    if (!userName || !password) {
      return res.status(400).json({
        success: false, message: "All fields are required!"
      })
    }
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      existingUser.isVerified = true;
      await existingUser.save();
    }

    if (!existingUser) {
      return res.status(400).json({ success: false, message: "User don't exists!" })
    }

    //compare password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false, message: "Invalid credentials!"
      })
    }

    const userId = existingUser._id

    //sign token 
    const token = await generateToken(userId)

    //save in db
    existingUser.token = token
    existingUser.isLoggedIn = true;
    await existingUser.save()

    return res.status(200).json({
      success: true,
      message: `Welcome back ${existingUser.name}`,
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        userName: existingUser.userName,
        email: existingUser.email,
        profilePic: existingUser.profilePic,
        bio: existingUser.bio,
        gender: existingUser.gender,
        country: existingUser.country,
        followers: existingUser.followers,
        following: existingUser.following,
        posts: existingUser.posts,
        saved: existingUser.saved,
      },
      token,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token")

    const userId = req.userId || (req.user && req.user._id)
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        token: null,
        isLoggedIn: false
      })
    }

    return res.status(200).json({
      success: true,
      message: "User logged out successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).populate("posts")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
export const getProfile = async (req, res) => {
  try {
    const userName = req.params.userName
    // extracting user ID from request params (supports both :userId and :id)
    const user = await User.findOne({ userName }).select("-password")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const editProfile = async (req, res) => {
  try {
    const { name, userName, bio, country, gender, profession, profilePic } = req.body
    let user = await User.findById(req.userId).select("-password")
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!"
      })
    }
    const sameUserWithUserName = await User.findOne({ userName }).select('-password')
    if (sameUserWithUserName && !sameUserWithUserName._id.equals(req.userId)) {
      return res.status(400).json({
        success: false,
        message: "UserName Already exists"
      })
    }

    let uploadedProfilePic = user.profilePic;

    if (req.file) {
      uploadedProfilePic = await uploadToCloudinary(req.file.path);
    }
    user.profilePic = uploadedProfilePic;
    user.name = name || user.name
    user.userName = userName || user.userName
    user.bio = bio || user.bio
    user.profession = profession || user.profession
    user.country = country || user.country
    user.gender = gender || user.gender
    user.profilePic = profilePic || user.profilePic

    await user.save()

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user
    })
  } catch (error) {
    console.error("Profile update error:", error.message)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId }
    }).select("-password")
    return res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
