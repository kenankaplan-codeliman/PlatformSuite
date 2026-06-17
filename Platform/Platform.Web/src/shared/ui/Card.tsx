import { Card as AntCard, type CardProps as AntCardProps } from "antd";
import type { ReactNode } from "react";

export interface CardProps {
  title?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  variant?: "borderless" | "outlined";
  size?: "default" | "small";
  className?: string;
  style?: React.CSSProperties;
  /** antd Card slot stilleri (örn. header arka planı). */
  styles?: AntCardProps["styles"];
}

export function Card({
  title,
  extra,
  children,
  variant = "outlined",
  size,
  className,
  style,
  styles,
}: CardProps) {
  return (
    <AntCard
      title={title}
      extra={extra}
      variant={variant}
      size={size}
      className={className}
      style={style}
      styles={styles}
    >
      {children}
    </AntCard>
  );
}
