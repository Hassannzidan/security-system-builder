import { describe, expect, it } from 'vitest';

import { splitTitleForTwoTone } from './splitTitleForTwoTone';

describe('splitTitleForTwoTone', () => {
  it('splits a multi-word title at the last space', () => {
    expect(splitTitleForTwoTone('Cam Unlimited')).toEqual({ head: 'Cam', tail: 'Unlimited' });
    expect(splitTitleForTwoTone('Cam Pro Unlimited')).toEqual({
      head: 'Cam Pro',
      tail: 'Unlimited',
    });
  });

  it('treats a single-word title as all-accent (empty head)', () => {
    expect(splitTitleForTwoTone('Basic')).toEqual({ head: '', tail: 'Basic' });
  });

  it('returns empty parts for an empty string', () => {
    expect(splitTitleForTwoTone('')).toEqual({ head: '', tail: '' });
  });

  it('keeps a trailing space in the head and leaves the tail empty', () => {
    expect(splitTitleForTwoTone('Cam Unlimited ')).toEqual({ head: 'Cam Unlimited', tail: '' });
  });
});
