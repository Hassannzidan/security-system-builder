import type { ApiResponse, Category } from '@security-system-builder/shared';
import { API_ROUTES } from '@security-system-builder/shared';
import { apiClient } from './apiClient';

export const categoryService = {
  async list(): Promise<Category[]> {
    const { data } = await apiClient.get<ApiResponse<Category[]>>(API_ROUTES.categories);
    return data.data;
  },
};
