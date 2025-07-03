import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import { updateOrderStatus } from '../../redux/slices/order/orderSlice';
import type { Order, OrderStatus } from '../../types/orderTypes';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.order);

  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleStatusChange = async () => {
    if (newStatus !== order.status) {
      setMessage(null); // Clear previous messages
      const confirmUpdate = window.confirm(`Are you sure you want to change order status to '${newStatus}'?`);
      if (!confirmUpdate) {
        return;
      }

      const resultAction = await dispatch(updateOrderStatus({ orderId: order.id, status: newStatus }));

      if (updateOrderStatus.fulfilled.match(resultAction)) {
        setMessage({ type: 'success', text: 'Order status updated successfully!' });
      } else {
        setMessage({ type: 'error', text: error || 'Failed to update order status.' });
      }
    }
  };

  const orderStatusOptions: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3 className="modal-title">Order Details - #{order.id.substring(0, 8)}...</h3>
        <button onClick={onClose} className="modal-close-button">
          &times;
        </button>

        <div className="order-details-grid">
          {/* Buyer Info */}
          <div>
            <h4 className="section-title">Buyer Information</h4>
            <p><strong>Buyer ID:</strong> {order.buyerId}</p>
          </div>

          {/* Shipping Details */}
          <div>
            <h4 className="section-title">Shipping Details</h4>
            <p><strong>Address:</strong> {order.shippingAddress}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h4 className="section-title">Order Items</h4>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Medical Supply</th>
                  <th>Quantity</th>
                  <th>Price/Unit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="product-cell">
                      {/* item.supply is implicitly of type MedicalSupply from orderTypes.ts */}
                      <img
                        src={item.supply.imageUrl || `https://placehold.co/40x40/cccccc/333333?text=No+Img`}
                        alt={item.supply.name}
                        className="product-image"
                      />
                      <div>
                        <div className="product-name">{item.supply.name}</div>
                        <div className="product-meta">Item Code: {item.supply.itemCode}</div>
                        <div className="product-meta">Unit: {item.supply.unitOfMeasure}</div>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.priceAtOrder.toFixed(2)}</td>
                    <td>${(item.quantity * item.priceAtOrder).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="total-amount-display">Total Order Amount: ${order.totalAmount.toFixed(2)}</p>
        </div>

        {/* Order Status Update Section */}
        <div className="status-update-section">
          <div>
            <label htmlFor="orderStatus" className="form-label">Update Status:</label>
            <select
              id="orderStatus"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
              className="status-select"
              disabled={loading}
            >
              {orderStatusOptions.map(statusOption => (
                <option key={statusOption} value={statusOption}>{statusOption}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleStatusChange}
            className={`btn-primary ${loading || newStatus === order.status ? 'btn-disabled' : ''}`}
            disabled={loading || newStatus === order.status}
          >
            {loading ? 'Updating...' : 'Save Status'}
          </button>
        </div>

        {/* Message display area */}
        {message && (
          <p className={`message-text ${message.type === 'error' ? 'message-error' : 'message-success'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;