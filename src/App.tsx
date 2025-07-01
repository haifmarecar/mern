import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './redux/store';
import { logout } from './redux/slices/authSlice';

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SellerRegisterForm from "./forms/SellerRegisterForm";
import CustomerRegisterForm from "./forms/CustomerRegisterForm";
import AdminRegisterForm from "./forms/AdminRegisterForm";

import './App.css'; // Your main application CSS (no Tailwind imports here now)

// Placeholder for a protected route/dashboard for after login
const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    // No need to navigate here, the ProtectedRoute will handle redirect
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-green-700">Welcome to your Dashboard!</h1>
      {user && (
        <p className="mt-4 text-xl text-gray-800">
          Hello, {user.name || user.companyName || user.email}! Your role is: {user.role}.
        </p>
      )}
      <p className="mt-4 text-lg text-gray-600">You are logged in.</p>
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

// Protected Route component (using Redux state)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/seller" element={<SellerRegisterForm />} />
          <Route path="/register/customer" element={<CustomerRegisterForm />} />
          <Route path="/register/admin" element={<AdminRegisterForm />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="*" element={<div className="text-center text-2xl text-gray-700">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;