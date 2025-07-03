import React, { useEffect, useState } from 'react'; // Import useState
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicalSupplies } from '../../redux/slices/product/productSlice';
import { fetchOrders } from '../../redux/slices/order/orderSlice';
import type { MedicalSupply } from '../../types/productTypes'; // Already imported
import type { Order } from '../../types/orderTypes';
import type{ AppDispatch, RootState } from '../../redux/store';

const SellerDashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { supplies, loading: suppliesLoading, error: suppliesError } = useSelector((state: RootState) => state.product);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector((state: RootState) => state.order);
  const supplierId = useSelector((state: RootState) => state.auth.user?.id);

  // State to hold the currently selected medical supply for detailed view
  const [selectedSupply, setSelectedSupply] = useState<MedicalSupply | null>(null); // Explicitly using MedicalSupply here

  useEffect(() => {
    if (supplierId) {
      dispatch(fetchMedicalSupplies(supplierId));
      dispatch(fetchOrders(supplierId));
    }
  }, [dispatch, supplierId]);

  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  const totalSuppliesCount = supplies.length;
  const outOfStockSupplies = supplies.filter(s => s.status === 'Out of Stock').length;
  const lowStockSupplies = supplies.filter(s => s.status === 'Low Stock').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  // Handler to set the selected supply
  const handleSelectSupply = (supply: MedicalSupply) => {
    setSelectedSupply(supply);
  };

  return (
    <div className="seller-dashboard-container">
      <h1>Supplier Dashboard</h1>

      <div className="dashboard-summary">
        <h2>Overview</h2>
        <div className="summary-cards">
          <div className="card">
            <h3>Total Medical Supplies</h3>
            <p>{totalSuppliesCount}</p>
          </div>
          <div className="card">
            <h3>Out of Stock</h3>
            <p>{outOfStockSupplies}</p>
          </div>
          <div className="card">
            <h3>Low Stock</h3>
            <p>{lowStockSupplies}</p>
          </div>
          <div className="card">
            <h3>Pending Orders</h3>
            <p>{pendingOrdersCount}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-recent-supplies">
        <h2>Your Recent Medical Supplies</h2>
        {suppliesLoading ? (
          <p>Loading medical supplies...</p>
        ) : suppliesError ? (
          <p className="error-message">Error loading supplies: {suppliesError}</p>
        ) : supplies.length === 0 ? (
          <p>No medical supplies added yet.</p>
        ) : (
          <ul>
            {supplies.slice(0, 5).map((supply: MedicalSupply) => ( // Explicitly typing 'supply' here
              <li key={supply.id} onClick={() => handleSelectSupply(supply)} style={{ cursor: 'pointer' }}>
                <strong>{supply.name}</strong> ({supply.itemCode}) - {supply.quantityAvailable} {supply.unitOfMeasure} available
                {/* Optionally add a button for more details */}
                <button onClick={(e) => { e.stopPropagation(); handleSelectSupply(supply); }}>View Details</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* New section to display selected MedicalSupply details */}
      {selectedSupply && (
        <div className="dashboard-selected-supply-details">
          <h2>Details for: {selectedSupply.name}</h2>
          <p><strong>Category:</strong> {selectedSupply.category}</p>
          <p><strong>Price per Unit:</strong> ${selectedSupply.pricePerUnit.toFixed(2)}</p>
          <p><strong>Quantity Available:</strong> {selectedSupply.quantityAvailable} {selectedSupply.unitOfMeasure}</p>
          <p><strong>Status:</strong> {selectedSupply.status}</p>
          <p><strong>Manufacturer:</strong> {selectedSupply.manufacturer}</p>
          <p><strong>Item Code:</strong> {selectedSupply.itemCode}</p>
          {selectedSupply.expirationDate && <p><strong>Expiration Date:</strong> {selectedSupply.expirationDate}</p>}
          <p><strong>Description:</strong> {selectedSupply.description}</p>
          {selectedSupply.imageUrl && <img src={selectedSupply.imageUrl} alt={selectedSupply.name} style={{ maxWidth: '200px', maxHeight: '200px' }} />}
          <button onClick={() => setSelectedSupply(null)}>Close Details</button>
        </div>
      )}

      <div className="dashboard-recent-orders">
        <h2>Recent Orders</h2>
        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : ordersError ? (
          <p className="error-message">Error loading orders: {ordersError}</p>
        ) : recentOrders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <ul>
            {recentOrders.map((order: Order) => ( // Explicitly typing 'order' here
              <li key={order.id}>
                Order ID: {order.id.substring(0, 8)}... - Total: ${order.totalAmount.toFixed(2)} - Status: {order.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;