import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // We will create this slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here as you create more slices
  },
  // Optionally add middleware, devTools, etc.
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;