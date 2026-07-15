/**
 * Centralised react-query key factories.
 *
 * Keeping keys in one hierarchical factory (rather than loose arrays) makes
 * cache reads and invalidations consistent and typo-free: invalidating
 * `stepsKeys.all` clears every steps query, while `stepsKeys.lists()`
 * targets the list query.
 */
export const stepsKeys = {
  all: ['steps'] as const,
  lists: () => [...stepsKeys.all, 'list'] as const,
};
