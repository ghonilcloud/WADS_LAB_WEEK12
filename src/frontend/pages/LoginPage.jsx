import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import NavbarComponent from "../components/NavbarComponent";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, error } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Show error if login fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(login({ email, password }));
  };

  return (
    <>
      <NavbarComponent />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-lg text-green-800 font-semibold mb-4">
          Please login!
        </h1>
        <form className="flex flex-col gap-3 w-80" onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded-md"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition disabled:bg-green-400"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
