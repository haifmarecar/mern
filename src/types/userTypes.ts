// --- Form Data Interfaces ---
export interface BaseUser {
  email: string;
}

export interface AuthCredentials extends BaseUser {
  password: string;
}

export interface SellerRegisterFormData extends BaseUser {
  companyName: string;
  contactNumber: string;
  originCountry: string;
  companyLogo: File | null; // Changed to File | null for direct File object handling, or FileList | null if preferred
}

export interface CustomerRegisterFormData extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

export type AdminRole = "superadmin" | "useradmin";

export interface AdminRegisterFormData extends AuthCredentials {
  name: string;
  role: AdminRole;
  confirmPassword: string;
}

export interface LoginFormInputs extends AuthCredentials {
}

// --- Redux State & Action Types ---
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    role: string; // 'seller', 'customer', 'admin'
    name?: string; // For customers/admins
    companyName?: string; // For sellers
  } | null;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  // Add other slices of your Redux store here
}