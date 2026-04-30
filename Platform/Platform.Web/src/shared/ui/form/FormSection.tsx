import type { ReactNode } from 'react';

export interface FormSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}

/**
 * Form alanlarını mantıksal gruplayan beyaz kart paneli.
 * Başlık + açıklama + içerik.
 */
export function FormSection({ title, description, extra, children }: FormSectionProps) {
  return (
    <section
      style={{
        background: '#ffffff',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        marginBottom: 16,
        overflow: 'hidden',
      }}
    >
      {(title || extra) && (
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '14px 20px',
            borderBottom: '1px solid #f0f0f0',
            background: '#fafafa',
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'rgba(0, 0, 0, 0.88)',
                  lineHeight: 1.4,
                }}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                style={{
                  margin: '4px 0 0',
                  color: 'rgba(0, 0, 0, 0.55)',
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {extra && <div>{extra}</div>}
        </header>
      )}
      <div style={{ padding: '20px 20px 4px' }}>{children}</div>
    </section>
  );
}
