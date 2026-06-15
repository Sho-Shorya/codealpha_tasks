import nodemailer from "nodemailer"
import "dotenv/config"

export const sendOptMail = async (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Password reset otp',
    html:`<p>Your Opt for passwrod reset is <b>${otp}</b></p>`

  };
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    // Email sent successfully
  });
}

