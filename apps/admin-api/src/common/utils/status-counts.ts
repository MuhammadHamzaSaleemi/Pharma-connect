/**
 * Turns a Prisma `groupBy({ by: ['status'], _count: { _all: true } })` result into a count per
 * status (0 for statuses with no rows) plus the overall total, for dashboard stat cards.
 */
export function toStatusCounts<S extends string>(
  statuses: S[],
  groups: { status: string; _count: { _all: number } }[],
): { total: number; byStatus: Record<S, number> } {
  const byStatus = Object.fromEntries(statuses.map((status) => [status, 0])) as Record<S, number>;
  let total = 0;
  for (const { status, _count } of groups) {
    byStatus[status as S] = _count._all;
    total += _count._all;
  }
  return { total, byStatus };
}
