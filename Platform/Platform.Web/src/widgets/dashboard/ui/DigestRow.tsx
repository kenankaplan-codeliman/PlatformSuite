import type { ReactNode } from 'react';
import { Text } from '../../../shared/ui/Typography';

interface DigestRowProps {
  title: string;
  subtitle?: ReactNode;
  meta?: ReactNode;
  extra?: ReactNode;
  onClick?: () => void;
}

/** Liste widget'larının tek satırı: sol başlık/alt başlık, sağ meta/extra. Tıklanınca detaya gider. */
export function DigestRow({ title, subtitle, meta, extra, onClick }: DigestRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        padding: '6px 0',
        borderBottom: '1px solid rgba(5, 5, 5, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div>
          <Text ellipsis>{title}</Text>
        </div>
        {subtitle ? (
          <div>
            <Text type="secondary" ellipsis style={{ fontSize: 12 }}>
              {subtitle}
            </Text>
          </div>
        ) : null}
      </div>
      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        {meta ? <div>{meta}</div> : null}
        {extra ? (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {extra}
            </Text>
          </div>
        ) : null}
      </div>
    </div>
  );
}
