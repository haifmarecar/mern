import axios from 'axios';
import type {
  MedicalSupply, // This import is now actively used
  AddMedicalSupplyFormData,
  FetchProductsApiResponse,
  AddUpdateProductApiResponse,
  DeleteProductApiResponse
} from '../types/productTypes';

const API_URL = 'http://localhost:5000/api/medical-supplies';

const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const fetchMedicalSupplies = async (supplierId?: string): Promise<FetchProductsApiResponse> => {
  const url = supplierId ? `${API_URL}/supplier/${supplierId}` : API_URL;
  const response = await axios.get<FetchProductsApiResponse>(url, getConfig());
  return response.data;
};

export const addMedicalSupply = async (supplyData: AddMedicalSupplyFormData): Promise<AddUpdateProductApiResponse> => {
  const formData = new FormData();
  formData.append('name', supplyData.name);
  formData.append('category', supplyData.category);
  formData.append('pricePerUnit', supplyData.pricePerUnit.toString());
  formData.append('description', supplyData.description);
  formData.append('quantityAvailable', supplyData.quantityAvailable.toString());
  formData.append('unitOfMeasure', supplyData.unitOfMeasure);
  formData.append('status', supplyData.status);
  formData.append('manufacturer', supplyData.manufacturer);
  formData.append('itemCode', supplyData.itemCode);
  if (supplyData.expirationDate) {
    formData.append('expirationDate', supplyData.expirationDate);
  }
  if (supplyData.image) {
    formData.append('image', supplyData.image);
  }

  const response = await axios.post<AddUpdateProductApiResponse>(API_URL, formData, {
    headers: {
      ...getConfig().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateMedicalSupply = async (
  id: string,
  supplyData: Partial<AddMedicalSupplyFormData>
): Promise<AddUpdateProductApiResponse> => {
  const formData = new FormData();
  for (const key in supplyData) {
    const typedKey = key as keyof AddMedicalSupplyFormData;
    if (Object.prototype.hasOwnProperty.call(supplyData, typedKey) && supplyData[typedKey] !== undefined) {
      if (typedKey === 'image') {
        if (supplyData.image) {
          formData.append(typedKey, supplyData.image);
        }
      } else {
        formData.append(typedKey, String(supplyData[typedKey]));
      }
    }
  }

  const response = await axios.put<AddUpdateProductApiResponse>(`${API_URL}/${id}`, formData, {
    headers: {
      ...getConfig().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteMedicalSupply = async (supplyId: string): Promise<DeleteProductApiResponse> => {
  const response = await axios.delete<DeleteProductApiResponse>(`${API_URL}/${supplyId}`, getConfig());
  return response.data;
};

export const getMedicalSupplyById = async (id: string): Promise<MedicalSupply> => {
  const response = await axios.get<MedicalSupply>(`${API_URL}/${id}`, getConfig());
  return response.data;
};