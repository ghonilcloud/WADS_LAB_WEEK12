import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromLocalStorage } from "./features/auth/authSlice";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  // Check if user is already authenticated on app load
  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
  }, [dispatch]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </>
  );
}

export default App;
