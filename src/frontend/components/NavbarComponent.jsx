import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { logout } from '../features/auth/authSlice';
import toast from "react-hot-toast";
import LogoImg from "../assets/logo.png";

const NavbarComponent = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate('/signin');
  };

  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal);
  };

  return (
    <nav className="flex w-full justify-between items-center bg-green-100 shadow-md py-3 px-10">
      {/* Logo */}
      <Link to="/">
        <div className="flex gap-1 justify-center items-center cursor-pointer">
          <img src={LogoImg} alt="logo-image" className="h-6 w-6" />
          <p className="text-lg font-semibold text-green-600 hover:text-green-700 transition ease-in-out">
            ToDoSome
          </p>
        </div>
      </Link>

      {/* Navigation Menu */}
      <div className="flex gap-6 justify-center items-center text-green-900 font-semibold">
        <Link to="/" className="text-sm hover:text-green-700">
          My ToDo
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-3 relative">
            <div 
              onClick={toggleProfileModal}
              className="w-10 h-10 rounded-full bg-green-800 text-white flex items-center justify-center font-semibold cursor-pointer hover:bg-green-700 transition"
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            {showProfileModal && (
              <div className="absolute top-12 right-0 bg-white shadow-lg rounded-md p-4 w-64 z-10">
                <div className="flex flex-col gap-3">
                  <div className="border-b pb-2">
                    <p className="font-medium">Account Info</p>
                    <p className="text-sm text-gray-600">{user?.email || 'User'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white text-sm py-2 px-4 rounded-md hover:bg-red-500 transition ease-in-out w-full"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              to="/signin"
              className="bg-green-800 text-white text-sm py-2 px-6 rounded-md hover:bg-green-700 transition ease-in-out"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white text-sm py-2 px-6 rounded-md hover:bg-green-700 transition ease-in-out"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarComponent;
