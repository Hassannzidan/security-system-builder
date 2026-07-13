import { useQuery } from '@tanstack/react-query';
import { stepsService } from '@/services';
import { stepsKeys } from '@/lib/queryKeys';

/**
 * Fetch a single step by id. Disabled until a non-empty `stepId` is provided so
 * it can be called unconditionally from components.
 */
export function useStepQuery(stepId: string) {
  return useQuery({
    queryKey: stepsKeys.detail(stepId),
    queryFn: () => stepsService.getById(stepId),
    enabled: !!stepId,
    staleTime: 5 * 60_000,
  });
}
