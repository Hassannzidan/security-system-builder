import { useState } from 'react';

import { ProductCard, type ProductCardProps } from '@/components/common';

/**
 * Demo showcase for the reusable <ProductCard />.
 *
 * The same component reproduces the design per product: some cards have a
 * discount badge, some have variants, some have neither. Clicking a card
 * toggles its selected (purple border) state.
 */

type DemoProduct = Omit<
  ProductCardProps,
  'quantity' | 'onQuantityChange' | 'selected' | 'onSelectedChange' | 'orientation'
> & {
  id: string;
  initialQuantity?: number;
  initiallySelected?: boolean;
};

const IMG = (label: string) =>
  `https://placehold.co/400x400/f0f4f7/6f7882?text=${encodeURIComponent(label)}`;

const PRODUCTS: DemoProduct[] = [
  {
    id: 'wyze-cam-v4',
    title: 'Wyze Cam v4',
    description: 'The clearest Wyze Cam ever made.',
    imageUrl: IMG('Cam v4'),
    badge: 'Save 22%',
    learnMoreHref: '#',
    price: 27.98,
    compareAtPrice: 35.98,
    initialQuantity: 1,
    initiallySelected: true,
    variants: [
      { id: 'white', label: 'White', thumbnailUrl: IMG('W') },
      { id: 'grey', label: 'Grey', thumbnailUrl: IMG('G') },
      { id: 'black', label: 'Black', thumbnailUrl: IMG('B') },
    ],
    defaultVariantId: 'white',
  },
  {
    id: 'wyze-cam-pan-v3',
    title: 'Wyze Cam Pan v3',
    description: '360° pan and 180° tilt security camera.',
    imageUrl: IMG('Pan v3'),
    badge: 'Save 12%',
    learnMoreHref: '#',
    price: 34.98,
    compareAtPrice: 39.98,
    initialQuantity: 2,
    initiallySelected: true,
    variants: [
      { id: 'white', label: 'White', thumbnailUrl: IMG('W') },
      { id: 'black', label: 'Black', thumbnailUrl: IMG('B') },
    ],
    defaultVariantId: 'white',
  },
  {
    id: 'wyze-cam-floodlight-v2',
    title: 'Wyze Cam Floodlight v2',
    description: '2K floodlight camera with a 160° wide-angle view for your garage.',
    imageUrl: IMG('Floodlight'),
    badge: 'Save 22%',
    learnMoreHref: '#',
    price: 69.98,
    compareAtPrice: 89.98,
    initialQuantity: 0,
    variants: [
      { id: 'white', label: 'White', thumbnailUrl: IMG('W') },
      { id: 'black', label: 'Black', thumbnailUrl: IMG('B') },
    ],
    defaultVariantId: 'white',
  },
  {
    id: 'wyze-duo-cam-doorbell',
    title: 'Wyze Duo Cam Doorbell',
    description: 'Two cameras. Two views. Double the porch protection.',
    imageUrl: IMG('Duo Cam'),
    learnMoreHref: '#',
    price: 69.98,
    initialQuantity: 0,
  },
];

export function HomePage() {
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.initialQuantity ?? 0])),
  );
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.initiallySelected ?? false])),
  );

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 font-['Gilroy'] text-2xl font-bold text-[#0B0D10]">Products</h1>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {PRODUCTS.map(({ id, initialQuantity: _initial, initiallySelected: _sel, ...card }) => (
            <ProductCard
              key={id}
              {...card}
              orientation="horizontal"
              quantity={quantities[id]}
              onQuantityChange={(q) => setQuantities((prev) => ({ ...prev, [id]: q }))}
              selected={selected[id]}
              onSelectedChange={(value) => setSelected((prev) => ({ ...prev, [id]: value }))}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
