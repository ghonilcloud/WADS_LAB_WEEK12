import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, getUserInfo } from "../redux/slices/authSlice";
import { FaUserCircle } from "react-icons/fa";
import UserInfoModal from "./UserInfoModal";
import LogoImg from "../assets/logo.png";
import toast from "react-hot-toast";

const NavbarComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      navigate("/signin");
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  const handleUserInfoClick = async () => {
    try {
      await dispatch(getUserInfo()).unwrap();
      setShowUserInfo(true);
    } catch (err) {
      toast.error(err.message || "Failed to fetch user information");
    }
  };

  return (
    <nav className="flex w-full justify-between items-center bg-green-100 shadow-md py-3 px-10">
      {/* Logo */}
      <a href="/">
        <div className="flex gap-1 justify-center items-center cursor-pointer">
          <img src={LogoImg} alt="logo-image" className="h-6 w-6" />
          <p className="text-lg font-semibold text-green-600 hover:text-green-700 transition ease-in-out">
            ToDoSome
          </p>
        </div>
      </a>

      {/* Navigation Menu */}
      <div className="flex gap-6 justify-center items-center text-green-900 font-semibold">
        <a href="/" className="text-sm">
          My ToDo
        </a>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleUserInfoClick}
              className="hover:opacity-80 transition-opacity"
              title="View Profile"
            >
              {user?.user_image ? (
                <img
                  src={user.user_image}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-green-800" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white text-sm py-2 px-4 rounded-md hover:bg-red-500 transition ease-in-out"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a
              href="/signin"
              className="bg-green-800 text-white text-sm py-2 px-4 rounded-md hover:bg-green-700 transition ease-in-out"
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-green-600 text-white text-sm py-2 px-4 rounded-md hover:bg-green-500 transition ease-in-out"
            >
              Sign Up
            </a>
          </div>
        )}
      </div>

      {/* User Info Modal */}
      {showUserInfo && user && (
        <UserInfoModal user={user} onClose={() => setShowUserInfo(false)} />
      )}
    </nav>
  );
};

export default NavbarComponent;
