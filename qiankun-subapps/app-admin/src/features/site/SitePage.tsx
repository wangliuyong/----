import { Button, Card, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import PageError from '../../components/_common/PageError';
import PageLoading from '../../components/_common/PageLoading';
import { useApiBase } from '../../context/ApiBaseContext';
import { adminApi } from '../../utils/adminApi';
import type { SiteConfig } from '../../types';
import { useSite } from './hooks/useSite';

/** 路由 /site — 站点基础信息 */
export default function SitePage() {
  const apiBase = useApiBase();
  const { site, setSite, loading, error } = useSite();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!site) return;
    form.setFieldsValue({
      siteName: site.siteName,
      githubUrl: site.githubUrl,
      email: site.email,
    });
  }, [site, form]);

  if (loading) return <PageLoading />;
  if (!site) return <PageError message={error || '站点配置加载失败'} />;

  const handleSubmit = async (values: Partial<SiteConfig>) => {
    setSaving(true);
    try {
      setSite(await adminApi.updateSite(apiBase, values));
      message.success('站点设置已保存');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="站点设置">
    <Form
      form={form}
      layout="vertical"
      style={{ maxWidth: 520 }}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="站点名称"
        name="siteName"
        rules={[{ required: true, message: '请输入站点名称' }]}
      >
        <Input placeholder="显示在导航栏的站点名" />
      </Form.Item>
      <Form.Item label="GitHub 链接" name="githubUrl">
        <Input placeholder="https://github.com/..." />
      </Form.Item>
      <Form.Item label="联系邮箱" name="email">
        <Input placeholder="example@email.com" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={saving}>
          保存
        </Button>
      </Form.Item>
    </Form>
    </Card>
  );
}
