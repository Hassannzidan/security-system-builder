import { colors } from '@/design-tokens';
import { cn } from '@/lib/utils';

export function LearnMoreLink({
  href,
  onClick,
  label,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
}) {
  const className = 'font-semibold underline underline-offset-2';
  const style = { color: colors.text.link };
  if (href) {
    return (
      <a href={href} onClick={onClick} className={className} style={style}>
        {label}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(className, 'align-baseline')}
      style={style}
    >
      {label}
    </button>
  );
}
