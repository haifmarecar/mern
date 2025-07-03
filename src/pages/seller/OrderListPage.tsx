import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, clearOrderError } from '../../redux/slices/order/orderSlice'; // clearOrderError kept
import type { Order } from '../../types/orderTypes';
import type { AppDispatch, RootState } from '../../redux/store';

const OrderListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, loading, error } = useSelector((state: RootState) => state.order);
  const supplierId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (supplierId) {
      dispatch(fetchOrders(supplierId));
    }

    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch, supplierId]); // Added dispatch to dependency array for cleanup function

  const handleViewOrder = (order: Order) => {
    alert(`Viewing details for Order ID: ${order.id}\nTotal: $${order.totalAmount}\nStatus: ${order.status}`);
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="order-list-container">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found yet.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Buyer ID</th>
              <th>Items Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.substring(0, 8)}...</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{order.buyerId.substring(0, 8)}...</td>
                <td>{order.items.length}</td>
                <td>
                  <button onClick={() => handleViewOrder(order)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderListPage;