// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './redux/store';
import { logout } from './redux/slices/authSlice';

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SellerRegisterForm from "./forms/SellerRegisterForm";
import CustomerRegisterForm from "./forms/CustomerRegisterForm";
import AdminRegisterForm from "./forms/AdminRegisterForm";

// Seller Pages (NEW IMPORTS)
import SellerDashboard from "./pages/seller/SellerDashboard";
import AddProductPage from "./pages/seller/AddProductPage";
import ProductListPage from "./pages/seller/ProductListPage";
import OrderListPage from "./pages/seller/OrderListPage";

import './App.css';

// ProtectedRoute for general authenticated users (Dashboard)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// SellerProtectedRoute (Specific for sellers)
const SellerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== 'seller') { // Check for seller role
    return <Navigate to="/login" replace />; // Redirect if not authenticated or not a seller
  }

  return <>{children}</>;
};

// Dashboard component (can be a generic user dashboard or an admin/customer dashboard)
const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-green-700">Welcome to your Dashboard!</h1>
      {user && (
        <p className="mt-4 text-xl text-gray-800">
          Hello, {user.name || user.companyName || user.email}! Your role is: {user.role}.
        </p>
      )}
      {user?.role === 'seller' && (
        <Link to="/seller/dashboard" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition-colors">
          Go to Seller Panel
        </Link>
      )}
      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

// Basic Navbar for logged-in users
const AppNavbar: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) return null; // Don't show navbar if not logged in

  return (
    <nav className="bg-indigo-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user?.role === 'seller' ? '/seller/dashboard' : '/dashboard'} className="text-2xl font-bold">
          {user?.role === 'seller' ? 'Seller Panel' : 'Dashboard'}
        </Link>
        <div className="flex items-center space-x-4">
          {user?.role === 'seller' && (
            <>
              <Link to="/seller/products" className="hover:text-indigo-200">Products</Link>
              <Link to="/seller/orders" className="hover:text-indigo-200">Orders</Link>
            </>
          )}
          <span className="text-lg">Welcome, {user?.name || user?.companyName || user?.email}!</span>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-700 rounded hover:bg-red-800 transition-colors">Logout</button>
        </div>
      </div>
    </nav>
  );
};


function App() {
  return (
    <Router>
      <AppNavbar /> {/* Include the Navbar here */}
      <div className="min-h-screen bg-gray-100 flex flex-col"> {/* Adjust styling for content below navbar */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/seller" element={<SellerRegisterForm />} />
          <Route path="/register/customer" element={<CustomerRegisterForm />} />
          <Route path="/register/admin" element={<AdminRegisterForm />} />

          {/* General User Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Seller Panel Routes (NEW) */}
          <Route path="/seller/dashboard" element={<SellerProtectedRoute><SellerDashboard /></SellerProtectedRoute>} />
          <Route path="/seller/products" element={<SellerProtectedRoute><ProductListPage /></SellerProtectedRoute>} />
          <Route path="/seller/products/add" element={<SellerProtectedRoute><AddProductPage /></SellerProtectedRoute>} />
          {/* Product details/edit can use modal, but if you need a dedicated page: */}
          {/* <Route path="/seller/products/edit/:id" element={<SellerProtectedRoute><EditProductPage /></SellerProtectedRoute>} /> */}
          <Route path="/seller/orders" element={<SellerProtectedRoute><OrderListPage /></SellerProtectedRoute>} />
          {/* Order details can use modal, but if you need a dedicated page: */}
          {/* <Route path="/seller/orders/:id" element={<SellerProtectedRoute><OrderDetailsPage /></SellerProtectedRoute>} /> */}

          <Route path="*" element={<div className="text-center text-2xl text-gray-700 mt-20">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;