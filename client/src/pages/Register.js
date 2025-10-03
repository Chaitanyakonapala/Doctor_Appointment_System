import React, { useState } from "react";
import axios from "axios";
import "../styles/RegisterStyles.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State Management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Send OTP
  const handleSendOtp = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      const res = await axios.post("/api/v1/user/send-otp", { email });
      if (res.data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to send OTP");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const res = await axios.post("/api/v1/user/verify-otp", { email, otp });
      if (res.data.success) {
        setOtpVerified(true);
        toast.success("OTP verified successfully!");
      } else {
        toast.error("Invalid or expired OTP");
      }
    } catch (err) {
      console.log(err);
      toast.error("OTP verification failed");
    }
  };

  // Register User
// Register User
const handleRegister = async (e) => {
  e.preventDefault();

  if (!otpVerified) {
    toast.error("Please verify your OTP first");
    return;
  }

  try {
    dispatch(showLoading());
    const res = await axios.post("/api/v1/user/register", {
      name,
      email,
      password,
    });
    dispatch(hideLoading());

    if (res.data.success) {
      toast.success("Registered Successfully");
      navigate("/login");
    } else {
      toast.error(res.data.message || "Registration failed");
    }
  } catch (error) {
    dispatch(hideLoading());
    console.log("Register Error:", error);
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};


  return (
    <div className="form-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h3 className="text-center">Register Form</h3>

        {/* Name */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group mt-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-secondary mt-2"
            onClick={handleSendOtp}
            disabled={otpSent}
          >
            {otpSent ? "OTP Sent" : "Send OTP"}
          </button>
        </div>

        {/* OTP */}
        {otpSent && (
          <div className="form-group mt-3">
            <label>Enter OTP</label>
            <input
              type="text"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            <button
              type="button"
              className="btn btn-success mt-2"
              onClick={handleVerifyOtp}
              disabled={otpVerified}
            >
              {otpVerified ? "OTP Verified" : "Verify OTP"}
            </button>
          </div>
        )}

        {/* Password */}
        <div className="form-group mt-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Register */}
        <Link to="/login" className="m-2">
          Already have an account?
        </Link>
        <button
          className="btn btn-primary mt-3"
          type="submit"
          disabled={!otpVerified}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
