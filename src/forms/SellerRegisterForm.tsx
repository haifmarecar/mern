import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerSeller } from '../redux/slices/authSlice';
import type {SellerRegisterFormData} from '../types/userTypes';
import type {RootState, AppDispatch } from '../redux/store';

const SellerRegisterForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<SellerRegisterFormData>({
    companyName: '',
    email: '',
    contactNumber: '',
    originCountry: '',
    companyLogo: null,
  });

  const [formErrors, setFormErrors] = useState({
    companyName: '',
    email: '',
    contactNumber: '',
    originCountry: '',
    companyLogo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Clear error for the field as user types
    setFormErrors({ ...formErrors, [e.target.id]: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      companyLogo: e.target.files ? e.target.files[0] : null,
    });
    setFormErrors({ ...formErrors, companyLogo: '' });
  };

  const validateForm = () => {
    let valid = true;
    const errors = { ...formErrors };

    if (!formData.companyName) {
      errors.companyName = 'Company Name is required';
      valid = false;
    } else { errors.companyName = ''; }

    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      valid = false;
    } else { errors.email = ''; }

    if (!formData.contactNumber) {
      errors.contactNumber = 'Contact Number is required';
      valid = false;
    } else if (!/^\d{10,15}$/.test(formData.contactNumber)) {
      errors.contactNumber = 'Contact number must be 10-15 digits and contain only numbers';
      valid = false;
    } else { errors.contactNumber = ''; }

    if (!formData.originCountry) {
      errors.originCountry = 'Origin Country is required';
      valid = false;
    } else { errors.originCountry = ''; }

    if (!formData.companyLogo) {
      errors.companyLogo = 'Company Logo is required';
      valid = false;
    } else {
        const file = formData.companyLogo;
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            errors.companyLogo = 'Max file size is 5MB.';
            valid = false;
        } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
            errors.companyLogo = 'Only .jpg, .jpeg, .png files are allowed.';
            valid = false;
        } else { errors.companyLogo = ''; }
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const resultAction = await dispatch(registerSeller(formData));
      if (registerSeller.fulfilled.match(resultAction)) {
        alert('Seller registration successful!');
        setFormData({ // Reset form
          companyName: '', email: '', contactNumber: '', originCountry: '', companyLogo: null
        });
        setFormErrors({ // Clear errors
          companyName: '', email: '', contactNumber: '', originCountry: '', companyLogo: ''
        });
        (document.getElementById('companyLogo') as HTMLInputElement).value = ''; // Clear file input
      } else {
        // Error message will be shown via Redux state
      }
    }
  };

  const countries = [
    'USA', 'Canada', 'UK', 'Australia', 'Germany', 'India', 'France',
    'Japan', 'China', 'Brazil', 'South Africa', 'Mexico', 'United Arab Emirates'
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900">Register as Seller</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            disabled={loading}
          />
          {formErrors.companyName && <p className="mt-1 text-sm text-red-600">{formErrors.companyName}</p>}
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
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            disabled={loading}
          />
          {formErrors.contactNumber && <p className="mt-1 text-sm text-red-600">{formErrors.contactNumber}</p>}
        </div>

        <div>
          <label htmlFor="originCountry" className="block text-sm font-medium text-gray-700">Origin Country:</label>
          <select
            id="originCountry"
            value={formData.originCountry}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
            disabled={loading}
          >
            <option value="">-- Select a country --</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {formErrors.originCountry && <p className="mt-1 text-sm text-red-600">{formErrors.originCountry}</p>}
        </div>

        <div>
          <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700">Company Logo:</label>
          <input
            type="file"
            id="companyLogo"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            disabled={loading}
          />
          {formErrors.companyLogo && <p className="mt-1 text-sm text-red-600">{formErrors.companyLogo}</p>}
        </div>

        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register as Seller'}
        </button>
      </form>
    </div>
  );
};

export default SellerRegisterForm;