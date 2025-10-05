import crypto from "crypto";
import User from "../models/UserModules.js";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const otpStore = {}; // In-memory OTP store

// Send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.verified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);

    // Save OTP in memory (expires in 5 mins)
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    // Send Email via Resend
    await resend.emails.send({
      from: "Doc Appointment <onboarding@resend.dev>", // customize if you want
      to: email,
      subject: "Your OTP Verification Code",
      html: `<h2>Your OTP: <b>${otp}</b></h2><p>Valid for 5 minutes.</p>`,
    });

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

    // OTP valid → Mark user as verified if exists, else proceed to signup
    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
