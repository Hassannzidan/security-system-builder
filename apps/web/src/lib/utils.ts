import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

import { typographyRoleNames } from '@/design-tokens/typography';

/**
 * Semantic `.text-<role>` typography classes share the `text-*` prefix with
 * Tailwind color utilities. Register them as their own group so `cn('text-badge
 * text-white')` keeps both instead of dropping the role class.
 */
const twMerge = extendTailwindMerge<'typography-role'>({
  extend: {
    classGroups: {
      'typography-role': [{ text: typographyRoleNames }],
    },
  },
});

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Used by shadcn/ui components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
