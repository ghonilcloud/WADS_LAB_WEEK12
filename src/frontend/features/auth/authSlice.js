import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/axios';

// Async thunk for signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Signup request initiated with data:', {
        email: userData.email,
        hasPassword: !!userData.password
      });
      
      const response = await api.post('/auth/signup', userData);
      console.log('Signup API response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signup error details:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received from server. Request details:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      return rejectWithValue(error.response?.data || { message: 'Network error occurred' });
    }
  }
);

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Login request initiated with data:', {
        email: userData.email,
        hasPassword: !!userData.password
      });
      
      const response = await api.post('/auth/login', userData);
      console.log('Login API response received:', response.data);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      
      return response.data;
    } catch (error) {
      console.error('Login error details:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received from server. Request details:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      return rejectWithValue(error.response?.data || { message: 'Network error occurred' });
    }
  }
);

// Async thunk for email verification
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/verify/${token}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isVerified: false,
    verificationSent: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isVerified = false;
      localStorage.removeItem('token');
    },
    loadUserFromLocalStorage: (state) => {
      // Check if token exists and set authenticated state
      const token = localStorage.getItem('token');
      if (token) {
        state.isAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
        state.verificationSent = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Signup failed';
      })
      // Email verification
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.isVerified = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Verification failed';
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Login failed';
      });
  }
});

export const { clearError, logout, loadUserFromLocalStorage } = authSlice.actions;
export default authSlice.reducer;