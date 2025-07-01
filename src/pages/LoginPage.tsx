import React from 'react';
import LoginForm from '../forms/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <LoginForm />
      <p className="mt-6 text-gray-700 text-lg">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
          Register here
        </Link>
        .
      </p>
      <p className="mt-2 text-gray-500 text-sm">
        (For testing, if logged in, you can go to <Link to="/dashboard" className="text-blue-500 hover:underline">/dashboard</Link>)
      </p>
    </div>
  );
};

export default LoginPage;