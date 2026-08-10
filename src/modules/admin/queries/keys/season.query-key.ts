export const seasonKeys = {
  all: (params?: { status?: boolean }) => ['seasons', params] as const,
  one: (params?: { status?: boolean }) => ['season', params] as const,
};
