import React from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Register</h1>
      <p className="text-lg text-gray-600 mb-8">Choose your account type to get started:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <Link
          to="/register/seller"
          className="block p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center flex flex-col items-center justify-center border-t-4 border-indigo-500"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-3">Seller Account</h2>
          <p className="text-gray-700 text-base">Register to set up your store and sell products on our platform.</p>
          <button className="mt-5 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Register as Seller
          </button>
        </Link>

        <Link
          to="/register/customer"
          className="block p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center flex flex-col items-center justify-center border-t-4 border-green-500"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-3">Customer Account</h2>
          <p className="text-gray-700 text-base">Create an account to browse and purchase products.</p>
          <button className="mt-5 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Register as Customer
          </button>
        </Link>

        <Link
          to="/register/admin"
          className="block p-8 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center flex flex-col items-center justify-center border-t-4 border-red-500"
        >
          <h2 className="text-2xl font-bold text-red-700 mb-3">Admin Account</h2>
          <p className="text-gray-700 text-base">For authorized personnel to manage the platform.</p>
          <button className="mt-5 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Register as Admin
          </button>
        </Link>
      </div>
      <p className="mt-10 text-gray-700 text-lg">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
          Login here
        </Link>
        .
      </p>
    </div>
  );
};

export default RegisterPage;