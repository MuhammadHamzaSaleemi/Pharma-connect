import { ApiProperty } from '@nestjs/swagger';

export class LabelCountDto {
  @ApiProperty({ example: 'Lahore' })
  label!: string;

  @ApiProperty({ example: 12 })
  count!: number;
}

/** Counts rows per label, largest first, for dashboard breakdowns. Null/empty labels are skipped. */
export function tally<T>(
  rows: T[],
  labelOf: (row: T) => string | null | undefined,
  limit?: number,
): LabelCountDto[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const label = labelOf(row)?.trim();
    if (label) counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}
