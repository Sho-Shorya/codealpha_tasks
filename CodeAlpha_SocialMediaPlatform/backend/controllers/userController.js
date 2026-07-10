import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../config/token.js"

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
    const user = await User.findById(userId)
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
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId || req.params.id
    // extracting user ID from request params (supports both :userId and :id)
    const user = await User.findById(userId).select("-password -token")
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

export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.userId
    //the id of the user we want to update
    const loggedInUser = req.user //from isAuthenticated middleware

    // Validate that userIdToUpdate is provided and not "undefined"
    if (!userIdToUpdate || userIdToUpdate === 'undefined') {
      return res.status(400).json({
        success: false,
        message: "User ID is required for profile update"
      })
    }

    const { firstName, lastName, address, city, zipCode, phoneNo, role, bio, country, gender } = req.body

    if (loggedInUser._id.toString() !== userIdToUpdate && loggedInUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile"
      })
    }
    let user = await User.findById(userIdToUpdate)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      })
    }
    // use the fields that actually exist on the model
    let profilePicUrl = user.profilePic || ""
    let profilePicPublicId = user.profilePicPublicId || ""

    // if files are present, enforce a single-file upload for profile updates
    if (Array.isArray(req.files) && req.files.length > 1) {
      return res.status(400).json({ success: false, message: "Only one file allowed for profile update" })
    }
    // accept either req.file (single) or the single element in req.files
    const fileToUpload = req.file || (Array.isArray(req.files) && req.files.length === 1 && req.files[0])
    if (fileToUpload) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId)
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile" },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )

        stream.end(fileToUpload.buffer)
      })

      profilePicUrl = uploadResult.secure_url
      profilePicPublicId = uploadResult.public_id
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.address = address || user.address
    user.city = city || user.city
    user.zipCode = zipCode || user.zipCode
    user.phoneNo = phoneNo || user.phoneNo
    user.role = role || user.role
    user.bio = bio !== undefined ? bio : user.bio
    user.country = country !== undefined ? country : user.country
    user.gender = gender !== undefined ? gender : user.gender
    user.profilePic = profilePicUrl
    user.profilePicPublicId = profilePicPublicId

    const updatedUser = await user.save()

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser
    })

  } catch (error) {
    console.error("Profile update error:", error.message)
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }

}

