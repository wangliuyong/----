import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Input, Space, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import PageError from '../../components/_common/PageError';
import PageLoading from '../../components/_common/PageLoading';
import { useApiBase } from '../../context/ApiBaseContext';
import { adminApi } from '../../utils/adminApi';
import { useSite } from '../site/useSite';

/** 路由 /nav — 顶栏导航项 */
export default function NavPage() {
  const apiBase = useApiBase();
  const { site, setSite, loading, error } = useSite();
  const [items, setItems] = useState(site?.nav ?? []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (site) setItems(site.nav);
  }, [site]);

  if (loading) return <PageLoading />;
  if (!site) return <PageError message={error || '站点配置加载失败'} />;

  const updateItem = (index: number, key: 'href' | 'label', value: string) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    setItems(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      setSite(await adminApi.updateNav(apiBase, items));
      message.success('导航已保存');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="导航管理"
      extra={
        <Space>
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
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
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
    </Card>
  );
}
