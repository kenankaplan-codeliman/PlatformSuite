import { useMemo } from 'react';
import { Layout, Menu, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentUserQuery } from '../../../entities/user/api/useCurrentUserQuery';
import { canAccessEntity } from '../../../entities/user/lib/privileges';
import type { AccessLevel } from '../../../entities/user/model/types';
import { isMenuGroup, type MenuGroup, type MenuItem, type MenuSchema } from '../model/types';

const { Sider } = Layout;

export interface AppSidebarProps {
  items: MenuSchema;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

type AntdMenuItem = NonNullable<MenuProps['items']>[number];

function toAntdItem(node: MenuItem | MenuGroup): AntdMenuItem {
  if (isMenuGroup(node)) {
    return {
      key: node.key,
      icon: node.icon,
      label: node.label,
      children: node.children.map(toAntdItem),
    };
  }
  return {
    key: node.key,
    icon: node.icon,
    label: node.label,
  };
}

/**
 * Privilege'lere göre menüyü süzer: `entity` taşıyan item, o entity'de `None`
 * dışında bir privilege yoksa düşer; tüm çocukları düşen grup da düşer.
 * `entity` taşımayan item'lar (Home gibi) her zaman kalır.
 */
function filterByPrivileges(
  schema: MenuSchema,
  privileges: Record<string, AccessLevel> | undefined,
): MenuSchema {
  const out: MenuSchema = [];
  for (const node of schema) {
    if (isMenuGroup(node)) {
      const children = filterByPrivileges(node.children, privileges);
      if (children.length > 0) out.push({ ...node, children });
    } else if (!node.entity || canAccessEntity(node.entity, privileges)) {
      out.push(node);
    }
  }
  return out;
}

function collectLeafKeys(items: MenuSchema): MenuItem[] {
  const out: MenuItem[] = [];
  const walk = (n: MenuItem | MenuGroup) => {
    if (isMenuGroup(n)) n.children.forEach(walk);
    else out.push(n);
  };
  items.forEach(walk);
  return out;
}

function findActiveLeaf(items: MenuSchema, pathname: string): MenuItem | undefined {
  const leaves = collectLeafKeys(items);
  // Önce exact match, ardından en uzun prefix
  const exact = leaves.find((l) => l.to === pathname);
  if (exact) return exact;
  return leaves
    .filter((l) => pathname.startsWith(l.to + '/') || pathname.startsWith(l.to))
    .sort((a, b) => b.to.length - a.to.length)[0];
}

function findOpenKeys(items: MenuSchema, activeKey: string | undefined): string[] {
  if (!activeKey) return [];
  const keys: string[] = [];
  const walk = (nodes: MenuSchema, trail: string[]): boolean => {
    for (const n of nodes) {
      if (isMenuGroup(n)) {
        if (walk(n.children, [...trail, n.key])) {
          keys.push(n.key);
          return true;
        }
      } else if (n.key === activeKey) {
        trail.forEach((k) => keys.push(k));
        return true;
      }
    }
    return false;
  };
  walk(items, []);
  return keys;
}

export function AppSidebar({ items, collapsed, onCollapse }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUserQuery();

  const visibleItems = useMemo(
    () => filterByPrivileges(items, user?.privileges),
    [items, user?.privileges],
  );

  const antdItems = useMemo(() => visibleItems.map(toAntdItem), [visibleItems]);
  const active = useMemo(
    () => findActiveLeaf(visibleItems, location.pathname),
    [visibleItems, location.pathname],
  );
  const defaultOpenKeys = useMemo(
    () => findOpenKeys(visibleItems, active?.key),
    [visibleItems, active?.key],
  );

  const leafByKey = useMemo(() => {
    const map = new Map<string, MenuItem>();
    collectLeafKeys(visibleItems).forEach((l) => map.set(l.key, l));
    return map;
  }, [visibleItems]);

  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      width={240}
      style={{ borderRight: '1px solid #f0f0f0', background: '#fff' }}
    >
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 48 }}>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} title={false} style={{ padding: 16 }} />
        ) : (
          <Menu
            mode="inline"
            theme="light"
            items={antdItems}
            selectedKeys={active ? [active.key] : []}
            defaultOpenKeys={defaultOpenKeys}
            onClick={({ key }) => {
              const leaf = leafByKey.get(String(key));
              if (leaf) navigate(leaf.to);
            }}
            style={{ borderInlineEnd: 0 }}
          />
        )}
      </div>
    </Sider>
  );
}
