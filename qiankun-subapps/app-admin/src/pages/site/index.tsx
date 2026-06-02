import { Button, Card, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { updateSite } from '../../api/site.api';
import PageLoading from '../../components/_common/PageLoading';
import type { SiteConfig } from '../../types';
import { useSite } from './useSite';

/** 路由 /site — 站点基础信息 */
export default function SitePage() {
  const { site, setSite, loading, reload } = useSite();
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
  if (!site) {
    return (
      <Card title="站点设置">
        <Button type="primary" onClick={() => void reload()}>
          重新加载
        </Button>
      </Card>
    );
  }

  const handleSubmit = async (values: Partial<SiteConfig>) => {
    setSaving(true);
    try {
      setSite(await updateSite(values));
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
