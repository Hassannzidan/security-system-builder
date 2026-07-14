import { spacing } from '@/design-tokens';
import { cn } from '@/lib/utils';

import { DiscountBadge } from './DiscountBadge';

export function ProductImage({
  src,
  alt,
  badge,
  vertical,
  /**
   * How the image sits within its frame. "start" (default) top-left anchors it —
   * ProductCard's original behaviour. "center" centers it, used by PlanCard.
   */
  align = 'start',
}: {
  src?: string;
  alt: string;
  badge?: string;
  vertical: boolean;
  align?: 'start' | 'center';
}) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'relative shrink-0',
        // Vertical: span the full card row. Horizontal: capped at 101px — a left
        // column on `sm`+, but on mobile the card stacks so center the capped
        // frame (`mx-auto`) instead of letting it anchor top-left.
        vertical ? 'w-full' : 'mx-auto w-full sm:mx-0 sm:flex sm:self-stretch',
      )}
      style={vertical ? { width: '100%' } : { width: '100%', maxWidth: spacing['101'] }}
    >
      {badge && <DiscountBadge>{badge}</DiscountBadge>}
      <div
        className={cn(
          'flex w-full overflow-hidden rounded-xl',
          centered ? 'items-center justify-center' : 'items-start justify-start',
          vertical ? 'aspect-[4/3]' : 'aspect-square sm:aspect-auto sm:min-h-0 sm:flex-1',
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={cn(
              'h-full w-full object-contain',
              centered ? 'object-center' : 'object-left-top',
            )}
          />
        ) : (
          <div className="h-full w-full bg-[#F0F4F7]" aria-hidden />
        )}
      </div>
    </div>
  );
}
