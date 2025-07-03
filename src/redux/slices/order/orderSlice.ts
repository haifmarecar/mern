import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderStatus } from '../../../types/orderTypes'; // Ensure OrderStatus is imported too

export const fetchOrders = createAsyncThunk<Order[], string>( // Returns an array of Order
  'order/fetchOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders/user/${userId}`); // Adjust API endpoint
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch orders');
      }
      const data = await response.json();
      // Important: Map _id to id if your backend uses _id
      return data.map((order: any) => ({ ...order, id: order._id || order.id }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Example thunk for fetching a single order
export const fetchSingleOrder = createAsyncThunk<Order, string>( // Returns a single Order
  'order/fetchSingleOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`); // Adjust API endpoint
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch order');
      }
      const data = await response.json();
      // Important: Map _id to id if your backend uses _id
      return { ...data, id: data._id || data.id };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Example thunk for deleting an order
export const deleteOrder = createAsyncThunk<string, string>( // Returns the ID of the deleted order
  'order/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete order');
      }
      // Assuming successful deletion returns the ID
      return orderId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// New: Async Thunk for Updating Order Status
interface UpdateOrderStatusArgs {
  orderId: string;
  status: OrderStatus;
}

export const updateOrderStatus = createAsyncThunk<Order, UpdateOrderStatusArgs>( // Returns the updated Order
  'order/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, { // Adjust API endpoint
        method: 'PATCH', // Or 'PUT', depending on your API design
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update order status');
      }
      const data = await response.json();
      // Important: Map _id to id if your backend uses _id
      return { ...data, id: data._id || data.id };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// --- Slice Definition ---

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  selectedOrder: Order | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Action to clear order-related errors
    clearOrderError: (state) => {
      state.error = null;
    },
    // Action to set a selected order (e.g., for editing or viewing details)
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch orders';
      })

      // Fetch Single Order
      .addCase(fetchSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch single order';
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
        if (state.selectedOrder?.id === action.payload) {
          state.selectedOrder = null; // Clear selected order if it was deleted
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to delete order';
      })

      // New: Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        // Find the updated order in the array and replace it
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        // If the updated order is the currently selected one, update it too
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to update order status';
      });
  },
});

export const { clearOrderError, setSelectedOrder } = orderSlice.actions;

export default orderSlice.reducer;