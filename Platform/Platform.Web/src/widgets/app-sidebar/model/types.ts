import type { ReactNode } from 'react';

export interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  to: string;
  privilege?: string;
}

export interface MenuGroup {
  key: string;
  label: string;
  icon?: ReactNode;
  children: Array<MenuItem | MenuGroup>;
}

export type MenuSchema = Array<MenuItem | MenuGroup>;

export function isMenuGroup(node: MenuItem | MenuGroup): node is MenuGroup {
  return 'children' in node;
}
