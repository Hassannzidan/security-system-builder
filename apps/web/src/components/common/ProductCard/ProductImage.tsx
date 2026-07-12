import { spacing } from '@/design-tokens';
import { cn } from '@/lib/utils';

import { DiscountBadge } from './DiscountBadge';

export function ProductImage({
  src,
  alt,
  badge,
  vertical,
}: {
  src?: string;
  alt: string;
  badge?: string;
  vertical: boolean;
}) {
  return (
    <div
      className={cn(
        'relative shrink-0',
        // Vertical: span the full card row. Horizontal: left column, capped at 101px.
        vertical ? 'w-full' : 'w-full sm:flex sm:self-stretch',
      )}
      style={vertical ? { width: '100%' } : { width: '100%', maxWidth: spacing['101'] }}
    >
      {badge && <DiscountBadge>{badge}</DiscountBadge>}
      <div
        className={cn(
          'flex w-full items-start justify-start overflow-hidden rounded-xl',
          vertical ? 'aspect-[4/3]' : 'aspect-square sm:aspect-auto sm:min-h-0 sm:flex-1',
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-contain object-left-top"
          />
        ) : (
          <div className="h-full w-full bg-[#F0F4F7]" aria-hidden />
        )}
      </div>
    </div>
  );
}
