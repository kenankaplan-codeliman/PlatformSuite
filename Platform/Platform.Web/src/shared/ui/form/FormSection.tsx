import { useState, type ReactNode } from 'react';
import { Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

export interface FormSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  /** Header tıklanınca içerik aç/kapanır. Default false — geriye dönük uyumlu. */
  collapsible?: boolean;
  /** `collapsible` true iken başlangıç durumu — default açık. */
  defaultCollapsed?: boolean;
}

/**
 * Form alanlarını mantıksal gruplayan beyaz kart paneli.
 * Başlık + açıklama + içerik. Opsiyonel olarak collapsible.
 */
export function FormSection({
  title,
  description,
  extra,
  children,
  collapsible = false,
  defaultCollapsed = false,
}: FormSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsible && collapsed;

  const handleToggle = () => {
    if (collapsible) setCollapsed((c) => !c);
  };

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
      {(title || extra || collapsible) && (
        <header
          onClick={handleToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '14px 20px',
            borderBottom: isCollapsed ? 'none' : '1px solid #f0f0f0',
            background: '#fafafa',
            cursor: collapsible ? 'pointer' : 'default',
            userSelect: collapsible ? 'none' : 'auto',
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
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {extra}
            {collapsible && (
              <Button
                size="small"
                icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
                onClick={handleToggle}
                aria-label={isCollapsed ? 'Genişlet' : 'Daralt'}
                aria-expanded={!isCollapsed}
              />
            )}
          </div>
        </header>
      )}
      {!isCollapsed && (
        <div style={{ padding: '20px 20px 4px' }}>{children}</div>
      )}
    </section>
  );
}
