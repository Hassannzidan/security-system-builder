import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services';
import { queryKeys } from '@/lib/queryClient';

/** Fetch the list of product categories. */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoryService.list,
  });
}
