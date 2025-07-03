import axios from 'axios';
import type { Order, CreateOrderData } from '../types/orderTypes';

const API_URL = 'http://5000/api/orders';

const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const fetchOrders = async (buyerId?: string): Promise<Order[]> => {
  const url = buyerId ? `${API_URL}/buyer/${buyerId}` : API_URL;
  // Explicitly type the axios.get response data as Order[]
  const response = await axios.get<Order[]>(url, getConfig());
  return response.data;
};

export const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
  // Explicitly type the axios.post response data as Order
  const response = await axios.post<Order>(API_URL, orderData, getConfig());
  return response.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  // Explicitly type the axios.get response data as Order
  const response = await axios.get<Order>(`${API_URL}/${orderId}`, getConfig());
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  // Explicitly type the axios.patch response data as Order
  const response = await axios.patch<Order>(`${API_URL}/${orderId}/status`, { status }, getConfig());
  return response.data;
};