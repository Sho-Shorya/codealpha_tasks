import jwt from "jsonwebtoken";

export const generateToken = async (userId) => {
  try {
    //signing token
    const token = await jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '10y' })
    return token
  } catch (error) {
    throw new Error(`Generate token error: ${error.message}`)
  }
}
