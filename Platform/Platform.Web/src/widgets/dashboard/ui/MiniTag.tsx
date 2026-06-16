import type { ReactNode } from 'react';

export type MiniTagColor = 'red' | 'orange' | 'blue' | 'cyan' | 'geekblue' | 'default';

const PALETTE: Record<MiniTagColor, { bg: string; fg: string }> = {
  red: { bg: '#fff1f0', fg: '#cf1322' },
  orange: { bg: '#fff7e6', fg: '#d46b08' },
  blue: { bg: '#e6f4ff', fg: '#0958d9' },
  cyan: { bg: '#e6fffb', fg: '#08979c' },
  geekblue: { bg: '#f0f5ff', fg: '#1d39c4' },
  default: { bg: '#fafafa', fg: '#595959' },
};

interface MiniTagProps {
  color?: MiniTagColor;
  children: ReactNode;
}

/** Renkli pill etiket. */
export function MiniTag({ color = 'default', children }: MiniTagProps) {
  const c = PALETTE[color] ?? PALETTE.default;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0 8px',
        borderRadius: 4,
        fontSize: 12,
        lineHeight: '20px',
        background: c.bg,
        color: c.fg,
      }}
    >
      {children}
    </span>
  );
}
