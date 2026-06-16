import type { ReactNode } from 'react';

export interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  to: string;
  privilege?: string;
  /**
   * Entity registry anahtarı ("Lead", "Account"...). Verildiğinde menü, o
   * entity'de `None` dışında en az bir privilege yoksa gizlenir. Boşsa
   * (örn. Home) menü her zaman görünür.
   */
  entity?: string;
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
