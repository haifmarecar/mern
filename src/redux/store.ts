import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orderReducer from './slices/order/orderSlice';
import productReducer from './slices/product/productSlice'; 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
    product: productReducer, // Keep 'product' as the reducer key
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;