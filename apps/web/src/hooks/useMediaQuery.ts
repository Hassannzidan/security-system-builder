import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query and re-render when it starts/stops matching.
 *
 * SSR/test-safe: when `window.matchMedia` is unavailable (e.g. a `node` test
 * environment) it simply returns `false` and never subscribes. On the client the
 * initial value is read synchronously so the first paint already reflects the
 * current viewport.
 *
 * @param query a media-query string, e.g. `'(max-width: 1439px)'`
 */
export function useMediaQuery(query: string): boolean {
  const getMatch = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false;

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    // Sync in case the query changed between render and effect.
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
