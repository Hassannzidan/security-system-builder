import { useState, type MouseEvent } from 'react';

import { borderWidth, colors, radius, spacing } from '@/design-tokens';
import { cn } from '@/lib/utils';

import { LearnMoreLink } from './LearnMoreLink';
import { PriceBlock } from './PriceBlock';
import { ProductImage } from './ProductImage';
import { QuantityStepper } from './QuantityStepper';
import { type ProductCardProps } from './types';
import { VariantPill } from './VariantPill';

/**
 * ProductCard — a reusable product tile used across catalog / storefront views.
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
 * Selection: clicking the card toggles a purple border. Interactive children
 * (links, buttons, steppers, variant pills) do not toggle selection.
 * Pass `selected` / `onSelectedChange` for controlled mode, or `defaultSelected`
 * for uncontrolled.
 *
 * Quantity and the active variant can be controlled (pass `quantity` /
 * `selectedVariantId` + change handlers) or left uncontrolled (the card keeps
 * its own state, seeded by `defaultQuantity` / `defaultVariantId`).
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
  defaultVariantId,
  onVariantChange,
  price,
  compareAtPrice,
  currency = 'USD',
  quantity,
  defaultQuantity = 0,
  onQuantityChange,
  minQuantity = 0,
  maxQuantity = 99,
  orientation = 'horizontal',
  selected,
  defaultSelected = false,
  onSelectedChange,
  className,
}: ProductCardProps) {
  // Uncontrolled fallbacks — used only when the matching prop is undefined.
  const [internalQuantity, setInternalQuantity] = useState(defaultQuantity);
  const [internalVariantId, setInternalVariantId] = useState(defaultVariantId ?? variants?.[0]?.id);
  const [internalSelected, setInternalSelected] = useState(defaultSelected);

  const currentQuantity = quantity ?? internalQuantity;
  const currentVariantId = selectedVariantId ?? internalVariantId;
  const isSelected = selected ?? internalSelected;

  const setQuantity = (next: number) => {
    const clamped = Math.min(maxQuantity, Math.max(minQuantity, next));
    if (quantity === undefined) setInternalQuantity(clamped);
    onQuantityChange?.(clamped);
  };

  const selectVariant = (variantId: string) => {
    if (selectedVariantId === undefined) setInternalVariantId(variantId);
    onVariantChange?.(variantId);
  };

  const toggleSelected = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    // Ignore clicks on interactive children so links / steppers / pills keep working.
    if (target.closest('a, button, input, textarea, select')) return;

    const next = !isSelected;
    if (selected === undefined) setInternalSelected(next);
    onSelectedChange?.(next);
  };

  const hasVariants = Boolean(variants && variants.length > 0);
  const showLearnMore = Boolean(learnMoreHref || onLearnMore);
  const isVertical = orientation === 'vertical';

  const info = (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col" style={{ gap: 10 }}>
      <div className="flex flex-col" style={{ gap: 8 }}>
        <h3 className="font-['Gilroy'] text-lg font-semibold leading-tight text-[#0B0D10]">
          {title}
        </h3>

        {(description || showLearnMore) && (
          <p className="font-['Gilroy'] text-sm font-medium leading-snug text-[#6F7882]">
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
        <div className="flex flex-wrap gap-1.5">
          {variants!.map((variant) => (
            <VariantPill
              key={variant.id}
              variant={variant}
              selected={variant.id === currentVariantId}
              onSelect={() => selectVariant(variant.id)}
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          'mt-auto flex flex-wrap items-center',
          isVertical ? 'justify-start' : 'justify-between',
        )}
        style={{ gap: 10, maxHeight: 35 }}
      >
        <QuantityStepper
          value={currentQuantity}
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
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      data-selected={isSelected}
      onClick={toggleSelected}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const next = !isSelected;
          if (selected === undefined) setInternalSelected(next);
          onSelectedChange?.(next);
        }
      }}
      className={cn(
        'flex cursor-pointer overflow-hidden bg-white transition-colors',
        isVertical ? 'flex-col' : 'flex-col sm:flex-row sm:items-stretch',
        className,
      )}
      style={{
        borderRadius: radius.lg,
        borderStyle: 'solid',
        borderWidth: borderWidth.DEFAULT,
        borderColor: isSelected ? colors.primary.DEFAULT : 'transparent',
        gap: spacing['19'],
        padding: isVertical ? `${spacing['11']} ${spacing['15']}` : spacing['11'],
        maxWidth: isVertical ? spacing['225'] : spacing['361.5'],
        ...(isVertical ? { maxHeight: spacing['331'] } : { minHeight: spacing['159'] }),
        width: '100%',
      }}
    >
      <ProductImage src={imageUrl} alt={imageAlt ?? title} badge={badge} vertical={isVertical} />
      {info}
    </div>
  );
}
