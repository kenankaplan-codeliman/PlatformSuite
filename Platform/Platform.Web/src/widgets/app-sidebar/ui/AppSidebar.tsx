import { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const antdItems = useMemo(() => items.map(toAntdItem), [items]);
  const active = useMemo(() => findActiveLeaf(items, location.pathname), [items, location.pathname]);
  const defaultOpenKeys = useMemo(() => findOpenKeys(items, active?.key), [items, active?.key]);

  const leafByKey = useMemo(() => {
    const map = new Map<string, MenuItem>();
    collectLeafKeys(items).forEach((l) => map.set(l.key, l));
    return map;
  }, [items]);

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
      </div>
    </Sider>
  );
}
