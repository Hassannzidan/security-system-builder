import type { ApiResponse, Product } from '@security-system-builder/shared';
import { API_ROUTES } from '@security-system-builder/shared';
import { apiClient } from './apiClient';

export const productService = {
  async list(): Promise<Product[]> {
    const { data } = await apiClient.get<ApiResponse<Product[]>>(API_ROUTES.products);
    return data.data;
  },
};
