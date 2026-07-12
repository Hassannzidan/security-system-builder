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
  const className = 'font-semibold text-[#4E2FD2] underline-offset-2 hover:underline';
  if (href) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cn(className, 'align-baseline')}>
      {label}
    </button>
  );
}
