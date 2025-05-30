import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import NavbarComponent from "../components/NavbarComponent";

const VerifyOTPPage = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email not found. Please go back to sign up.");
      return;
    }

    try {
      await dispatch(verifyOTP({ email, otp })).unwrap();
      toast.success("Email verified successfully! You can now log in.");
      navigate("/signin");
    } catch (err) {
      toast.error(err.message || "OTP verification failed");
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl text-green-800 font-semibold mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          We've sent a 6-digit verification code to {email}.<br />
          Please enter the code below to complete your registration.
        </p>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <form
          className="flex flex-col gap-4 w-80 bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleVerify}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="otp" className="text-sm font-medium text-gray-700">Verification Code</label>
            <input
              type="text"
              id="otp"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-3 rounded-md focus:ring-green-500 focus:border-green-500 text-center text-lg tracking-widest"
              required
              minLength={6}
              maxLength={6}
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 mt-2"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
          
          <div className="text-center mt-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <a href="/signin" className="text-green-600 hover:text-green-800">
                Try again
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default VerifyOTPPage;
