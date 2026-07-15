import { useQuery } from '@tanstack/react-query';
import { stepsService } from '@/services';
import { stepsKeys } from '@/lib/queryKeys';

/**
 * Fetch every bundle-builder step. Steps are static catalog data, so a long
 * `staleTime` avoids needless refetching while the user configures their bundle.
 */
export function useStepsQuery() {
  return useQuery({
    queryKey: stepsKeys.lists(),
    queryFn: stepsService.list,
    staleTime: 5 * 60_000,
  });
}
