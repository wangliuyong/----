import { useState, type ReactNode } from 'react';
import './ui.scss';

export interface AdminMenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: AdminMenuItem[];
}

export interface SidebarMenuProps {
  items: AdminMenuItem[];
  selectedKeys: string[];
  openKeys?: string[];
  collapsed?: boolean;
  onOpenChange?: (keys: string[]) => void;
  onClick?: (key: string) => void;
}

/** 侧栏导航菜单：多级折叠 + 选中高亮 */
export function SidebarMenu({
  items,
  selectedKeys,
  openKeys = [],
  collapsed = false,
  onOpenChange,
  onClick,
}: SidebarMenuProps) {
  return (
    <nav className={`sidebar-menu${collapsed ? ' sidebar-menu--collapsed' : ''}`} aria-label="主导航">
      <ul className="sidebar-menu__list">
        {items.map((item) => (
          <SidebarMenuNode
            key={item.key}
            item={item}
            depth={0}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            collapsed={collapsed}
            onOpenChange={onOpenChange}
            onClick={onClick}
          />
        ))}
      </ul>
    </nav>
  );
}

interface NodeProps {
  item: AdminMenuItem;
  depth: number;
  selectedKeys: string[];
  openKeys: string[];
  collapsed: boolean;
  onOpenChange?: (keys: string[]) => void;
  onClick?: (key: string) => void;
}

function SidebarMenuNode({
  item,
  depth,
  selectedKeys,
  openKeys,
  collapsed,
  onOpenChange,
  onClick,
}: NodeProps) {
  const hasChildren = Boolean(item.children?.length);
  const isOpen = openKeys.includes(item.key);
  const isSelected = selectedKeys.includes(item.key);

  const toggleOpen = () => {
    if (!hasChildren) return;
    const next = isOpen ? openKeys.filter((k) => k !== item.key) : [...openKeys, item.key];
    onOpenChange?.(next);
  };

  const handleClick = () => {
    if (hasChildren) {
      toggleOpen();
      return;
    }
    onClick?.(item.key);
  };

  return (
    <li className="sidebar-menu__item">
      <button
        type="button"
        className={[
          'sidebar-menu__btn',
          isSelected && 'sidebar-menu__btn--active',
          hasChildren && 'sidebar-menu__btn--group',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ paddingLeft: collapsed ? undefined : 12 + depth * 12 }}
        onClick={handleClick}
        title={collapsed && typeof item.label === 'string' ? item.label : undefined}
      >
        {item.icon ? <span className="sidebar-menu__icon">{item.icon}</span> : null}
        {!collapsed ? <span className="sidebar-menu__label">{item.label}</span> : null}
        {hasChildren && !collapsed ? (
          <span className={`sidebar-menu__arrow${isOpen ? ' sidebar-menu__arrow--open' : ''}`} aria-hidden>
            ›
          </span>
        ) : null}
      </button>
      {hasChildren && isOpen && !collapsed ? (
        <ul className="sidebar-menu__sublist">
          {item.children!.map((child) => (
            <SidebarMenuNode
              key={child.key}
              item={child}
              depth={depth + 1}
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              collapsed={collapsed}
              onOpenChange={onOpenChange}
              onClick={onClick}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
