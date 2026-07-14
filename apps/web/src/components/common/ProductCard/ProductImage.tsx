import { useState } from 'react';

import { cn } from '@/lib/utils';

import { DiscountBadge } from './DiscountBadge';

/**
 * Product/plan image frame: renders the image in a fixed-aspect box with an
 * optional discount badge and a flowing gradient placeholder shown until load,
 * across the vertical/horizontal and start/center layout variants. Falls back to
 * a blank tile when `src` is absent.
 */
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
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={cn(
        'relative shrink-0',
        vertical ? 'w-full' : 'w-full sm:flex sm:max-w-[101px] sm:self-stretch',
      )}
      style={{ width: '100%' }}
    >
      {badge && <DiscountBadge>{badge}</DiscountBadge>}
      <div
        className={cn(
          'relative flex w-full overflow-hidden rounded-xl',
          centered ? 'items-center justify-center' : 'items-start justify-start',
          vertical ? 'aspect-[4/3]' : 'aspect-[4/3] sm:aspect-auto sm:min-h-0 sm:flex-1',
        )}
      >
        {src ? (
          <>
            {/* ChatGPT-style loader — a soft gradient that flows until load. */}
            {!loaded && (
              <div
                aria-hidden
                className="absolute inset-0 animate-gradient-flow bg-gradient-to-r from-[#EDF1F5] via-[#DCE3EB] to-[#EDF1F5] motion-reduce:animate-none"
                style={{ backgroundSize: '200% 100%' }}
              />
            )}
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              className={cn(
                'h-full w-full object-contain transition-opacity duration-300',
                centered ? 'object-center' : 'object-left-top',
                loaded ? 'opacity-100' : 'opacity-0',
              )}
            />
          </>
        ) : (
          <div className="h-full w-full bg-[#F0F4F7]" aria-hidden />
        )}
      </div>
    </div>
  );
}
