import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, LoginFormInputs, SellerRegisterFormData, CustomerRegisterFormData, AdminRegisterFormData } from '../../types/userTypes';

// --- Async Thunks for API Calls ---

// Login Thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginFormInputs, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', { // Replace with your login API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Login failed.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token
      localStorage.setItem('userRole', data.role); // Store user role
      return data; // This data will be available in fulfilled action payload
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error.');
    }
  }
);

// Seller Registration Thunk
export const registerSeller = createAsyncThunk(
  'auth/registerSeller',
  async (formData: SellerRegisterFormData, { rejectWithValue }) => {
    try {
      const apiFormData = new FormData();
      apiFormData.append('companyName', formData.companyName);
      apiFormData.append('email', formData.email);
      apiFormData.append('contactNumber', formData.contactNumber);
      apiFormData.append('originCountry', formData.originCountry);
      if (formData.companyLogo) {
        apiFormData.append('companyLogo', formData.companyLogo); // Append the File object
      }

      const response = await fetch('http://localhost:5000/api/register/seller', { // Replace with your API
        method: 'POST',
        body: apiFormData, // No 'Content-Type' header needed for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Seller registration failed.');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error.');
    }
  }
);

// Customer Registration Thunk
export const registerCustomer = createAsyncThunk(
  'auth/registerCustomer',
  async (formData: CustomerRegisterFormData, { rejectWithValue }) => {
    try {
      // Destructure to remove confirmPassword for backend
      const { confirmPassword, ...dataToSend } = formData;
      const response = await fetch('http://localhost:5000/api/register/customer', { // Replace with your API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Customer registration failed.');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error.');
    }
  }
);

// Admin Registration Thunk
export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (formData: AdminRegisterFormData, { rejectWithValue }) => {
    try {
      // Destructure to remove confirmPassword for backend
      const { confirmPassword, ...dataToSend } = formData;
      const response = await fetch('http://localhost:5000/api/register/admin', { // Replace with your API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Admin registration failed.');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error.');
    }
  }
);

// Initial State
const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('token'), // Check if token exists on load
  user: localStorage.getItem('token') ? { // Attempt to hydrate user from local storage
    id: 'guest', // Placeholder, populate from token if available
    email: 'guest@example.com', // Placeholder
    role: localStorage.getItem('userRole') || 'guest' // Populate role
  } : null,
  loading: false,
  error: null,
};

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          id: action.payload.id, // Assuming API returns user ID
          email: action.payload.email, // Assuming API returns email
          role: action.payload.role, // Assuming API returns role
          name: action.payload.name, // Assuming API returns name if applicable
          companyName: action.payload.companyName, // Assuming API returns companyName if applicable
        };
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed.';
        state.isAuthenticated = false;
        state.user = null;
      })

      // Register Seller
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSeller.fulfilled, (state, _action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;
        // Optionally log in the user after successful registration
        // state.isAuthenticated = true;
        // state.user = { id: action.payload.id, email: action.payload.email, role: 'seller' };
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Seller registration failed.';
      })

      // Register Customer
      .addCase(registerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state, _action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Customer registration failed.';
      })

      // Register Admin
      .addCase(registerAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, _action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Admin registration failed.';
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;