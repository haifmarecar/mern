import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { MedicalSupply, AddMedicalSupplyFormData } from '../../../types/productTypes';

import {
  fetchMedicalSupplies as fetchMedicalSuppliesApi, // Renamed API call import
  addMedicalSupply as addMedicalSupplyApi,         // Renamed API call import
  updateMedicalSupply as updateMedicalSupplyApi,   // Renamed API call import
  deleteMedicalSupply as deleteMedicalSupplyApi    // Renamed API call import
} from '../../../services/productService'; 

interface MedicalSupplyState {
  supplies: MedicalSupply[]; 
  loading: boolean;
  error: string | null;
  selectedSupply: MedicalSupply | null; 
}

const initialState: MedicalSupplyState = {
  supplies: [],
  loading: false,
  error: null,
  selectedSupply: null,
};

export const fetchMedicalSupplies = createAsyncThunk<MedicalSupply[], string | undefined>(
  'product/fetchMedicalSupplies', 
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await fetchMedicalSuppliesApi(supplierId);
      return response.products; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch medical supplies');
    }
  }
);

export const addMedicalSupply = createAsyncThunk<MedicalSupply, AddMedicalSupplyFormData>(
  'product/addMedicalSupply', 
  async (supplyData, { rejectWithValue }) => {
    try {
      const response = await addMedicalSupplyApi(supplyData);
      return response.product; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to add medical supply');
    }
  }
);

export const updateMedicalSupply = createAsyncThunk<MedicalSupply, { id: string; supplyData: Partial<AddMedicalSupplyFormData> }>(
  'product/updateMedicalSupply', 
  async ({ id, supplyData }, { rejectWithValue }) => {
    try {
      const response = await updateMedicalSupplyApi(id, supplyData);
      return response.product; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update medical supply');
    }
  }
);


export const deleteMedicalSupply = createAsyncThunk<string, string>(
  'product/deleteMedicalSupply', 
  async (supplyId, { rejectWithValue }) => {
    try {
      await deleteMedicalSupplyApi(supplyId);
      return supplyId; // Return the ID of the deleted supply
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete medical supply');
    }
  }
);

const productSlice = createSlice({
  name: 'product', 
  initialState,
  reducers: {
    
    clearProductError: (state) => { 
      state.error = null;
    },
    
    setSelectedProduct: (state, action: PayloadAction<MedicalSupply | null>) => { 
      state.selectedSupply = action.payload; // Update 'selectedSupply'
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Medical Supplies 
      .addCase(fetchMedicalSupplies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalSupplies.fulfilled, (state, action: PayloadAction<MedicalSupply[]>) => {
        state.loading = false;
        state.supplies = action.payload; // Update 'supplies'
      })
      .addCase(fetchMedicalSupplies.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An unknown error occurred';
      })
      // Add Medical Supply 
      .addCase(addMedicalSupply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMedicalSupply.fulfilled, (state, action: PayloadAction<MedicalSupply>) => {
        state.loading = false;
        state.supplies.push(action.payload); // Add new supply to the list
      })
      .addCase(addMedicalSupply.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An unknown error occurred';
      })
      // Update Medical Supply 
        .addCase(updateMedicalSupply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedicalSupply.fulfilled, (state, action: PayloadAction<MedicalSupply>) => {
        state.loading = false;
        const index = state.supplies.findIndex((s: MedicalSupply) => s.id === action.payload.id); // 's' for supply, using 'id'
        if (index !== -1) {
          state.supplies[index] = action.payload; // Replace updated supply
        }
        state.selectedSupply = null; // Clear selected supply after update
      })
      .addCase(updateMedicalSupply.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An unknown error occurred';
      })
      // Delete Medical Supply (using deleteMedicalSupply thunk)
      .addCase(deleteMedicalSupply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMedicalSupply.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.supplies = state.supplies.filter((s: MedicalSupply) => s.id !== action.payload); // 's' for supply, using 'id'
      })
      .addCase(deleteMedicalSupply.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'An unknown error occurred';
      });
  },
});

// Export original action creator names for consistency with reducer
export const { clearProductError, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;