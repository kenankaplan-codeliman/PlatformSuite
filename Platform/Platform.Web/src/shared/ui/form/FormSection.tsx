import { useState, type ReactNode } from "react";
import { Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

/**
 * Collapsible davranışı:
 * - `none`: aç/kapa yok (default).
 * - `expanded`: collapsible, başlangıçta açık.
 * - `collapsed`: collapsible, başlangıçta kapalı.
 */
export type FormSectionCollapsible = "none" | "expanded" | "collapsed";

export interface FormSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  /** Aç/kapa davranışı. Default `none`. */
  collapsible?: FormSectionCollapsible;
  /**
   * İçeriği section kenarlarına yaslar (body padding'i sıfırlar).
   * İçinde tablo (TableField) olan section'lar için: tablo ile section
   * gövdesi arasındaki boşluğu kaldırır. Default `false`.
   */
  flush?: boolean;
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
  collapsible = "none",
  flush = false,
}: FormSectionProps) {
  const canCollapse = collapsible !== "none";
  const [collapsed, setCollapsed] = useState(collapsible === "collapsed");
  const isCollapsed = canCollapse && collapsed;

  const handleToggle = () => {
    if (canCollapse) setCollapsed((c) => !c);
  };

  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      {(title || extra || canCollapse) && (
        <header
          onClick={handleToggle}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "8px 20px",
            borderBottom: isCollapsed ? "none" : "1px solid #f0f0f0",
            background: "#fafafa",
            cursor: canCollapse ? "pointer" : "default",
            userSelect: canCollapse ? "none" : "auto",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(0, 0, 0, 0.88)",
                  lineHeight: 1.4,
                }}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                style={{
                  margin: "4px 0 0",
                  color: "rgba(0, 0, 0, 0.55)",
                  lineHeight: 1.5,
                }}
              >
                {description}
              </p>
            )}
          </div>
          <div
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {extra}
            {canCollapse && (
              <Button
                type="text"
                size="small"
                style={{
                  height: 20,
                  width: 20,
                  minWidth: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
                onClick={handleToggle}
                aria-label={isCollapsed ? "Genişlet" : "Daralt"}
                aria-expanded={!isCollapsed}
              />
            )}
          </div>
        </header>
      )}
      {!isCollapsed && (
        <div style={{ padding: flush ? 0 : "20px 20px 4px" }}>{children}</div>
      )}
    </section>
  );
}
