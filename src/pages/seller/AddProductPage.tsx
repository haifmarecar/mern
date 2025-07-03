import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Import the thunk for adding medical supplies from the productSlice
import { addMedicalSupply, clearProductError } from '../../redux/slices/product/productSlice';
// Import the types for medical supplies and form data
import type { AddMedicalSupplyFormData, MedicalSupplyCategory, MedicalSupplyStatus } from '../../types/productTypes';
import type { AppDispatch, RootState } from '../../redux/store'; // For Redux type safety
 // For Redux type safety

const AddProductPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Type the dispatch hook
  const { loading, error } = useSelector((state: RootState) => state.product); // Access loading/error from product slice

  // Initialize form data with new medical supply fields
  const [formData, setFormData] = useState<AddMedicalSupplyFormData>({
    name: '',
    category: '' as MedicalSupplyCategory, // Cast for initial empty string
    pricePerUnit: '',
    description: '',
    quantityAvailable: '',
    unitOfMeasure: '',
    status: '' as MedicalSupplyStatus, // Cast for initial empty string
    manufacturer: '',
    itemCode: '',
    expirationDate: '',
    image: null,
  });

  // Handle changes for text, select, and textarea inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch(clearProductError()); // Clear error on new input
  };

  // Handle changes for number inputs, allowing empty string initially
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value === '' ? '' : Number(e.target.value) });
    dispatch(clearProductError());
  };

  // Handle file input change for the image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null });
    dispatch(clearProductError());
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation (can be expanded)
    if (!formData.name || !formData.category || formData.pricePerUnit === '' ||
        formData.quantityAvailable === '' || !formData.unitOfMeasure || !formData.status ||
        !formData.manufacturer || !formData.itemCode || !formData.description) {
      alert('Please fill in all required fields.');
      return;
    }

    // Dispatch the addMedicalSupply thunk
    const resultAction = await dispatch(addMedicalSupply(formData));

    // Check if the action was fulfilled
    if (addMedicalSupply.fulfilled.match(resultAction)) {
      alert('Medical supply added successfully!');
      // Reset form after successful submission
      setFormData({
        name: '', category: '' as MedicalSupplyCategory, pricePerUnit: '',
        description: '', quantityAvailable: '', unitOfMeasure: '',
        status: '' as MedicalSupplyStatus, manufacturer: '',
        itemCode: '', expirationDate: '', image: null,
      });
      
      // navigate('/seller/products');
    }
  };

  return (
    <div className="add-supply-page-container">
      <h1>Add New Medical Supply</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Supply Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {/* Options based on MedicalSupplyCategory type */}
            {['Consumables', 'Equipment', 'Pharmaceuticals', 'Diagnostics', 'Surgical Instruments', 'Personal Protective Equipment (PPE)', 'Other'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="pricePerUnit">Price Per Unit:</label>
          <input
            type="number"
            id="pricePerUnit"
            name="pricePerUnit"
            step="0.01" // Allows decimal values for price
            value={formData.pricePerUnit}
            onChange={handleNumberChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unitOfMeasure">Unit of Measure:</label>
          <input
            type="text"
            id="unitOfMeasure"
            name="unitOfMeasure"
            value={formData.unitOfMeasure}
            onChange={handleChange}
            placeholder="e.g., Box, Vial, Piece"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantityAvailable">Quantity Available:</label>
          <input
            type="number"
            id="quantityAvailable"
            name="quantityAvailable"
            value={formData.quantityAvailable}
            onChange={handleNumberChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            {/* Options based on MedicalSupplyStatus type */}
            {['Available', 'Low Stock', 'Out of Stock', 'On Order', 'Expired', 'Recalled'].map(stat => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="manufacturer">Manufacturer:</label>
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="itemCode">Item Code (SKU):</label>
          <input
            type="text"
            id="itemCode"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expirationDate">Expiration Date (Optional):</label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image (Optional):</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*" // Restrict to image files
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Medical Supply'}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;