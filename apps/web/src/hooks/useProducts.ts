import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services';
import { queryKeys } from '@/lib/queryClient';

/** Fetch the product catalog. */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: productService.list,
  });
}
