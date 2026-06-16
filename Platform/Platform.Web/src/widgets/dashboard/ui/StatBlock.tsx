import type { ReactNode } from 'react';
import { Text } from '../../../shared/ui/Typography';

interface StatBlockProps {
  value: ReactNode;
  sub?: ReactNode;
  valueColor?: string;
}

/** KPI kartlarının büyük sayı + alt metni. */
export function StatBlock({ value, sub, valueColor }: StatBlockProps) {
  return (
    <div>
      <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: valueColor }}>{value}</div>
      {sub != null ? (
        <div style={{ marginTop: 2 }}>
          <Text type="secondary">{sub}</Text>
        </div>
      ) : null}
    </div>
  );
}
