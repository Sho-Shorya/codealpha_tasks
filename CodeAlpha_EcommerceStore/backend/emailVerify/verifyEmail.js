import nodemailer from "nodemailer"
import "dotenv/config"

export const verifyEmail = async (token, email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  const safeToken = encodeURIComponent(token)
  const verifyUrl = `${process.env.FRONTEND_URL.replace(/\/$/, '')}/verify/${safeToken}`

  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Hi!
Please follow the given link to verify your email:
${verifyUrl}

Thanks`
  };

  try {
    await transporter.sendMail(mailConfigurations)
    return true
  } catch (err) {
    // Log the error but don't throw — avoid crashing the server if mail fails
    console.error('verifyEmail: sendMail failed', err.message || err)
    return false
  }
}

