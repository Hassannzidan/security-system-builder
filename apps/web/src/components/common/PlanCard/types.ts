export interface PlanCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Optional discount badge text, e.g. "Save 23%". Hidden when omitted. */
  badge?: string;

  /** "Learn More" link target. Renders the link only when set. */
  learnMoreHref?: string;
  learnMoreLabel?: string;

  /** Active (current) price. */
  price: number;
  /** Original price shown struck-through beside the active price. */
  compareAtPrice?: number;
  currency?: string;
  /** Billing interval — renders a `/mo` suffix on both prices when 'month'. */
  interval?: 'month';

  /** Whether this plan is the currently-chosen radio option. */
  selected: boolean;
  onSelect: () => void;
  className?: string;
}
