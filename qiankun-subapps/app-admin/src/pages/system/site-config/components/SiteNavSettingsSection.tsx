import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { updateNav } from '../../../../api/site.api';
import type { NavItem, SiteConfig } from '../../../../types';

export interface SiteNavSettingsSectionProps {
  site: SiteConfig;
  setSite: (site: SiteConfig) => void;
}

/** 站点配置 Tab：顶栏导航项 */
export default function SiteNavSettingsSection({
  site,
  setSite,
}: SiteNavSettingsSectionProps) {
  const [items, setItems] = useState<NavItem[]>(site.nav);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(site.nav);
  }, [site]);

  const updateItem = (index: number, key: 'href' | 'label', value: string) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    setItems(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      setSite(await updateNav(items));
      message.success('导航已保存');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setItems([...items, { href: '/', label: '新导航' }])}
        >
          添加
        </Button>
        <Button type="primary" loading={saving} onClick={handleSave}>
          保存导航
        </Button>
      </Space>

      <Space orientation="vertical" style={{ width: '100%' }} size="middle">
        {items.map((item, index) => (
          <Space key={index} align="start" style={{ width: '100%' }}>
            <Input
              style={{ width: 200 }}
              placeholder="路径，如 /blog"
              value={item.href}
              onChange={(e) => updateItem(index, 'href', e.target.value)}
            />
            <Input
              style={{ width: 160 }}
              placeholder="显示标签"
              value={item.label}
              onChange={(e) => updateItem(index, 'label', e.target.value)}
            />
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => setItems(items.filter((_, j) => j !== index))}
            />
          </Space>
        ))}
        {items.length === 0 && (
          <Typography.Text type="secondary">暂无导航项，点击「添加」创建</Typography.Text>
        )}
      </Space>
    </div>
  );
}
