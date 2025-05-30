import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUp } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import NavbarComponent from "../components/NavbarComponent";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    personal_id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone_number: ""
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(signUp(formData)).unwrap();
      toast.success("Registered successfully! Please check your email for OTP verification.");
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-xl text-green-800 font-semibold mb-6">
          Create Account
        </h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        <form 
          className="flex flex-col gap-4 w-96 bg-white p-6 rounded-lg shadow-md"
          onSubmit={handleSignup}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="personal_id" className="text-sm font-medium text-gray-700">Personal ID</label>
            <input
              type="text"
              id="personal_id"
              name="personal_id"
              placeholder="Your personal ID"
              value={formData.personal_id}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-green-500 focus:border-green-500"
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-green-500 focus:border-green-500"
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-green-500 focus:border-green-500"
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-green-500 focus:border-green-500"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Password should be 6-20 characters with at least one number, one lowercase and one uppercase letter.
            </p>
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-green-500 focus:border-green-500"
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">Address (Optional)</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Your address"
              value={formData.address}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-green-500 focus:border-green-500"
              disabled={loading}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">Phone Number (Optional)</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              placeholder="Your phone number"
              value={formData.phone_number}
              onChange={handleChange}
              className="border p-2 rounded-md focus:ring-green-500 focus:border-green-500"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition disabled:bg-gray-400 mt-2"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/signin" className="text-green-600 hover:text-green-800">
                Log in
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignupPage;
