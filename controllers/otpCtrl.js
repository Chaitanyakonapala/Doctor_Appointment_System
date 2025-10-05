import crypto from "crypto";
import User from "../models/UserModules.js";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpStore = {}; // In-memory OTP store

// Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.verified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = crypto.randomInt(100000, 999999);

    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    // Send email using SendGrid API
    const msg = {
      to: email,
      from: process.env.FROM_EMAIL,
      subject: "Your OTP Verification Code",
      html: `<h2>Your OTP: <b>${otp}</b></h2><p>Valid for 5 minutes.</p>`,
    };

    await sgMail.send(msg);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore[email];
    if (!stored) return res.status(400).json({ message: "OTP not found" });

    if (Date.now() > stored.expires) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (parseInt(otp) !== stored.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
