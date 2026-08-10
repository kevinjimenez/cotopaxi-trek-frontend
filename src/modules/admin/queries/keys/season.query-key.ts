export const seasonKeys = {
  all: (params?: { status?: boolean }) => ['seasons', params] as const,
  // current: ['seasons_with_mountains', 'current'] as const,
};
