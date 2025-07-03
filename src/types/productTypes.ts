export type MedicalSupplyCategory =
  'Consumables' | 'Equipment' | 'Pharmaceuticals' | 'Diagnostics' | 'Surgical Instruments' | 'Personal Protective Equipment (PPE)' | 'Other';

export type MedicalSupplyStatus =
  'Available' | 'Low Stock' | 'Out of Stock' | 'On Order' | 'Expired' | 'Recalled';

export interface MedicalSupply {
  id: string; // Unique identifier for the medical supply
  name: string;
  category: MedicalSupplyCategory; // Using new category type
  pricePerUnit: number; // Price per unit of supply (changed from price)
  description: string;
  quantityAvailable: number; // Current inventory count (changed from quantity)
  unitOfMeasure: string; // e.g., "box", "bottle", "piece", "pack" (New field)
  status: MedicalSupplyStatus; // Using new status type
  manufacturer: string; // New field
  itemCode: string; // Internal or manufacturer's item code (e.g., SKU, part number) (New field)
  expirationDate?: string; // Optional: ISO date string for supplies with expiry (New field)
  imageUrl: string; // URL of the uploaded image
  supplierId: string; // To link supplies to the supplier who added them (renamed from sellerId)
  createdAt?: string;
  updatedAt?: string;
}

export interface AddMedicalSupplyFormData {
  name: string;
  category: MedicalSupplyCategory | '';
  pricePerUnit: number | '';
  description: string;
  quantityAvailable: number | '';
  unitOfMeasure: string;
  status: MedicalSupplyStatus | '';
  manufacturer: string;
  itemCode: string;
  expirationDate?: string; // Can be an empty string if not required in form, but ideally a Date object or valid string
  image: File | null; // For the file upload
}

// API Response Interfaces (referencing the new MedicalSupply type)
export interface FetchProductsApiResponse { // Kept name for compatibility
  products: MedicalSupply[]; // Now returns MedicalSupply array
}

export interface AddUpdateProductApiResponse { // Kept name for compatibility
  product: MedicalSupply; // Now returns a MedicalSupply object
}

export interface DeleteProductApiResponse { // Kept name for compatibility
  message: string;
}