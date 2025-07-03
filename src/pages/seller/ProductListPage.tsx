import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// Import thunks and actions from productSlice
import {
  fetchMedicalSupplies, // Renamed thunk
  deleteMedicalSupply,  // Renamed thunk
  setSelectedProduct,   // Action (original name)
  clearProductError     // Action (original name)
} from '../../redux/slices/product/productSlice';
import type { MedicalSupply } from '../../types/productTypes'; // Import the MedicalSupply type
import type { AppDispatch, RootState } from '../../redux/store'; // For Redux type safety

const ProductListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Type the dispatch hook
  // Select medical supplies data from the Redux store (state.product.supplies)
  const { supplies, loading, error } = useSelector((state: RootState) => state.product);
  // Assuming supplierId comes from an auth slice; adjust if your auth state is different
  const supplierId = useSelector((state: RootState) => state.auth.user?.id);

  // Fetch medical supplies when the component mounts or supplierId changes
  useEffect(() => {
    if (supplierId) {
      dispatch(fetchMedicalSupplies(supplierId));
    }

    // --- RECTIFICATION START ---
    // Clear any product-related errors when the component unmounts
    return () => {
      dispatch(clearProductError());
    };
    // --- RECTIFICATION END ---
  }, [dispatch, supplierId]); // Added dispatch to the dependency array for the cleanup function

  // Handle deletion of a medical supply
  const handleDeleteSupply = async (supplyId: string) => {
    if (window.confirm('Are you sure you want to delete this medical supply?')) {
      const resultAction = await dispatch(deleteMedicalSupply(supplyId));
      if (deleteMedicalSupply.fulfilled.match(resultAction)) {
        alert('Medical supply deleted successfully!');
      } else {
        // The `error` from useSelector might not be immediately updated here
        // after a failed deletion. You might want to get the error from resultAction.payload
        // if your thunk rejects with an error payload.
        alert(`Failed to delete medical supply: ${error || 'Unknown error'}`);
      }
    }
  };

  // Handle editing a medical supply (placeholder for navigation)
  const handleEditSupply = (supply: MedicalSupply) => {
    dispatch(setSelectedProduct(supply)); // Set the selected supply for editing
    // Optionally navigate to an edit page, e.g., navigate(`/seller/edit-product/${supply.id}`);
    alert(`Editing supply: ${supply.name} (ID: ${supply.id})\n(Navigation to edit page would go here)`);
  };

  if (loading) {
    return <p>Loading medical supplies...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="supply-list-container">
      <h1>Your Medical Supplies</h1>
      {supplies.length === 0 ? (
        <p>No medical supplies found. Add some to get started!</p>
      ) : (
        <table className="supply-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price/Unit</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Item Code</th>
              <th>Expiration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply) => (
              <tr key={supply.id}>
                <td>
                  {supply.imageUrl ? (
                    <img src={supply.imageUrl} alt={supply.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>{supply.name}</td>
                <td>{supply.category}</td>
                <td>${supply.pricePerUnit.toFixed(2)}</td>
                <td>{supply.unitOfMeasure}</td>
                <td>{supply.quantityAvailable}</td>
                <td>{supply.status}</td>
                <td>{supply.itemCode}</td>
                <td>{supply.expirationDate ? new Date(supply.expirationDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button onClick={() => handleEditSupply(supply)}>Edit</button>
                  <button onClick={() => handleDeleteSupply(supply.id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductListPage;