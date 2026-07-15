import type { KeyboardEvent } from 'react';

import { borderWidth, colors, radius, spacing } from '@/design-tokens';
import { cn } from '@/lib/utils';

import { LearnMoreLink } from '../ProductCard/LearnMoreLink';
import { PriceBlock } from '../ProductCard/PriceBlock';
import { ProductImage } from '../ProductCard/ProductImage';
import { type PlanCardProps } from './types';

/**
 * PlanCard — a reusable, fully-controlled single-select (radio) plan tile.
 *
 * Unlike ProductCard this card has NO quantity stepper and NO variant chips: a
 * plan is a radio choice, so the ENTIRE card is the click target. It owns no
 * state — `selected` is controlled by the parent and drives the highlighted
 * border (reusing the exact same token as ProductCard's selected state so the
 * two cards read as one system). `onSelect` fires on click and on Enter/Space.
 *
 * Accessibility: the card is `role="radio"` with `aria-checked`; the parent grid
 * is expected to wrap the set in `role="radiogroup"`.
 *
 * Layout note: the Figma doesn't show the plan step expanded, so this mirrors
 * ProductCard's vertical layout (image on top with an overlaid badge, then
 * title, description, Learn More, price) reusing the same radii, spacing and
 * typography tokens for visual consistency.
 */
export function PlanCard({
  title,
  description,
  imageUrl,
  imageAlt,
  badge,
  learnMoreHref,
  learnMoreLabel = 'Learn More',
  price,
  compareAtPrice,
  currency = 'USD',
  interval,
  selected,
  onSelect,
  className,
}: PlanCardProps) {
  const showLearnMore = Boolean(learnMoreHref);

  const lastSpace = title.lastIndexOf(' ');
  const titleLead = lastSpace >= 0 ? title.slice(0, lastSpace + 1) : '';
  const titleAccent = lastSpace >= 0 ? title.slice(lastSpace + 1) : title;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      data-selected={selected}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        'mx-auto flex cursor-pointer flex-col overflow-hidden bg-white transition-colors',
        className,
      )}
      style={{
        borderRadius: radius.lg,
        borderStyle: 'solid',
        borderWidth: borderWidth.DEFAULT,
        borderColor: selected ? colors.primary.DEFAULT : 'transparent',
        gap: spacing['19'],
        padding: `${spacing['11']} ${spacing['15']}`,
        maxWidth: spacing['255'],
        width: '100%',
      }}
    >
      <ProductImage src={imageUrl} alt={imageAlt ?? title} badge={badge} vertical align="center" />

      <div
        className="flex min-h-0 min-w-0 flex-1 flex-col justify-center"
        style={{ gap: spacing['10'] }}
      >
        <div className="flex flex-col" style={{ gap: spacing.sm }}>
          <h3 className="text-plan-title text-ink">
            {titleLead}
            <span style={{ color: colors.primary.DEFAULT }}>{titleAccent}</span>
          </h3>

          {(description || showLearnMore) && (
            <p className="text-card-description" style={{ color: colors.text.description }}>
              {description}
              {showLearnMore && (
                <>
                  {description ? ' ' : ''}
                  <LearnMoreLink href={learnMoreHref} label={learnMoreLabel} />
                </>
              )}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-start" style={{ gap: spacing['10'] }}>
          <PriceBlock
            price={price}
            compareAtPrice={compareAtPrice}
            currency={currency}
            layout="inline"
            interval={interval}
          />
        </div>
      </div>
    </div>
  );
}
