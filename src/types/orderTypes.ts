import type { MedicalSupply } from './productTypes'; 
export type OrderStatus =
  'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';

export interface OrderItem {
  supply: MedicalSupply; // Reference to the ordered medical supply
  quantity: number;
  priceAtOrder: number; // Price when the order was placed
}

export interface Order {
  id: string; // Unique order ID
  items: OrderItem[];
  totalAmount: number;
  buyerId: string; // ID of the firm/person placing the order
  supplierId: string; // ID of the supplier firm
  orderDate: string; // ISO date string
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// For creating a new order
export interface CreateOrderData {
  items: Array<{ supplyId: string; quantity: number }>; // Only send IDs and quantities
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
  supplierId: string; // To indicate which supplier the order is for
}