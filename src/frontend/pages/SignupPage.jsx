import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signup, verifyEmail } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import NavbarComponent from '../components/NavbarComponent';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get('token');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, verificationSent, isVerified } = useSelector((state) => state.auth);

  useEffect(() => {
    if (verificationToken) {
      handleVerification(verificationToken);
    }
  }, [verificationToken]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (verificationSent) {
      toast.success('Please check your email to verify your account!');
    }
  }, [verificationSent]);

  useEffect(() => {
    if (isVerified) {
      toast.success('Email verified successfully! You can now login.');
      navigate('/signin');
    }
  }, [isVerified, navigate]);

  const handleVerification = async (token) => {
    dispatch(verifyEmail(token));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    dispatch(signup({ email, password }));
  };

  return (
    <>
      <NavbarComponent />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-lg text-green-800 font-semibold mb-4">
          Create an Account
        </h1>
        <form className="flex flex-col gap-3 w-80" onSubmit={handleSignup}>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded-md"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition disabled:bg-green-400"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </>
  );
};

export default SignupPage;