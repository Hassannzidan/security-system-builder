import {
  borderWidth,
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  spacing,
} from '@/design-tokens';
import { cn } from '@/lib/utils';

import { LearnMoreLink } from './LearnMoreLink';
import { PriceBlock } from './PriceBlock';
import { ProductImage } from './ProductImage';
import { QuantityStepper } from './QuantityStepper';
import { type ProductCardProps } from './types';
import { VariantPill } from './VariantPill';

/**
 * ProductCard — a reusable, fully-controlled product tile.
 *
 * Every element below the title is optional so the same component can render a
 * fully-featured product (discount badge, variants, quantity stepper, compare-at
 * pricing) or a bare one (image, title, description, price) — the card only shows
 * what it is given.
 *
 * Layout is driven by `orientation`:
 *   - "horizontal" → image in a left column, product info in a right column.
 *   - "vertical"   → image on top, product info stacked underneath.
 *
 * The card owns no state: `quantity`, `selectedVariantId` and `selected` are all
 * controlled by the parent. The purple border is driven purely by `selected`
 * (the parent passes `quantity > 0`); clicking the card body does nothing.
 */
export function ProductCard({
  title,
  description,
  imageUrl,
  imageAlt,
  badge,
  learnMoreHref,
  onLearnMore,
  learnMoreLabel = 'Learn More',
  variants,
  selectedVariantId,
  onVariantChange,
  price,
  compareAtPrice,
  currency = 'USD',
  quantity,
  onQuantityChange,
  minQuantity = 0,
  maxQuantity = 99,
  orientation = 'horizontal',
  selected = false,
  className,
}: ProductCardProps) {
  const setQuantity = (next: number) => {
    const clamped = Math.min(maxQuantity, Math.max(minQuantity, next));
    onQuantityChange?.(clamped);
  };

  const hasVariants = Boolean(variants && variants.length > 0);
  const showLearnMore = Boolean(learnMoreHref || onLearnMore);
  const isVertical = orientation === 'vertical';

  const info = (
    <div
      className={cn('flex min-h-0 min-w-0 flex-1 flex-col', !hasVariants && 'justify-center')}
      style={{ gap: 10 }}
    >
      <div className="flex flex-col" style={{ gap: 8 }}>
        <h3
          className="text-[#0B0D10]"
          style={{
            fontFamily: fontFamily.primary.join(', '),
            fontWeight: fontWeight.semiBold,
            fontSize: isVertical ? fontSize['18'] : fontSize['16'],
            lineHeight: lineHeight['100'],
            letterSpacing: letterSpacing['0.6'],
          }}
        >
          {title}
        </h3>

        {(description || showLearnMore) && (
          <p
            className="font-['Gilroy'] text-xs font-medium"
            style={{
              color: colors.text.description,
              lineHeight: lineHeight['130'],
              letterSpacing: letterSpacing['0.6'],
            }}
          >
            {description}
            {showLearnMore && (
              <>
                {description ? ' ' : ''}
                <LearnMoreLink href={learnMoreHref} onClick={onLearnMore} label={learnMoreLabel} />
              </>
            )}
          </p>
        )}
      </div>

      {hasVariants && (
        <div className="flex flex-nowrap gap-1.5">
          {variants!.map((variant) => (
            <VariantPill
              key={variant.id}
              variant={variant}
              selected={variant.id === selectedVariantId}
              onSelect={() => onVariantChange?.(variant.id)}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          'flex flex-wrap items-center',
          hasVariants && 'mt-auto',
          isVertical ? 'justify-start' : 'justify-between',
        )}
        style={{ gap: 10 }}
      >
        <QuantityStepper
          value={quantity}
          min={minQuantity}
          max={maxQuantity}
          onChange={setQuantity}
          title={title}
        />
        <PriceBlock
          price={price}
          compareAtPrice={compareAtPrice}
          currency={currency}
          layout={isVertical ? 'inline' : 'stacked'}
        />
      </div>
    </div>
  );

  return (
    <div
      data-selected={selected}
      className={cn(
        'flex overflow-hidden bg-white transition-colors',
        isVertical ? 'flex-col' : 'flex-col sm:flex-row sm:items-stretch',
        className,
      )}
      style={{
        borderRadius: radius.lg,
        borderStyle: 'solid',
        borderWidth: borderWidth.DEFAULT,
        borderColor: selected ? colors.primary.DEFAULT : 'transparent',
        gap: spacing['19'],
        padding: isVertical ? `${spacing['11']} ${spacing['15']}` : spacing['11'],
        maxWidth: isVertical ? spacing['255'] : spacing['361.5'],
        ...(isVertical ? {} : { minHeight: spacing['159'] }),
        width: '100%',
      }}
    >
      <ProductImage src={imageUrl} alt={imageAlt ?? title} badge={badge} vertical={isVertical} />
      {info}
    </div>
  );
}
