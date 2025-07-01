import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdmin } from '../redux/slices/authSlice';
import type {AdminRegisterFormData, AdminRole} from '../types/userTypes';
import type { RootState, AppDispatch } from '../redux/store';

const AdminRegisterForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<AdminRegisterFormData>({
    name: '',
    email: '',
    role: '' as AdminRole, // Cast initially empty string
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setFormErrors({ ...formErrors, [e.target.id]: '' });
  };

  const validateForm = () => {
    let valid = true;
    const errors = { ...formErrors };

    if (!formData.name) {
      errors.name = 'Name is required';
      valid = false;
    } else { errors.name = ''; }

    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      valid = false;
    } else { errors.email = ''; }

    if (!formData.role) {
      errors.role = 'Role is required';
      valid = false;
    } else { errors.role = ''; }

    if (!formData.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
      valid = false;
    } else { errors.password = ''; }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirm Password is required';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      valid = false;
    } else { errors.confirmPassword = ''; }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const resultAction = await dispatch(registerAdmin(formData));
      if (registerAdmin.fulfilled.match(resultAction)) {
        alert('Admin registration successful!');
        setFormData({ name: '', email: '', role: '' as AdminRole, password: '', confirmPassword: '' });
        setFormErrors({ name: '', email: '', role: '', password: '', confirmPassword: '' });
      } else {
        // Error message will be shown via Redux state
      }
    }
  };

  const adminRoles: AdminRole[] = ['superadmin', 'useradmin'];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">Register as Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            disabled={loading}
          />
          {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            disabled={loading}
          />
          {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role:</label>
          <select
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            disabled={loading}
          >
            <option value="">-- Select a role --</option>
            {adminRoles.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
          {formErrors.role && <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            disabled={loading}
          />
          {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            disabled={loading}
          />
          {formErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>}
        </div>

        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register as Admin'}
        </button>
      </form>
    </div>
  );
};

export default AdminRegisterForm;