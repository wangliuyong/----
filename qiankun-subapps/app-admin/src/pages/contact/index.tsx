import { Button, Card, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import PageError from '../../components/_common/PageError';
import PageLoading from '../../components/_common/PageLoading';
import { useApiBase } from '../../context/ApiBaseContext';
import { adminApi } from '../../utils/adminApi';
import { useSite } from '../site/useSite';

const { TextArea } = Input;

/** 路由 /contact — 联系页文案与邮箱 */
export default function ContactPage() {
  const apiBase = useApiBase();
  const { site, setSite, loading, error } = useSite();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!site) return;
    form.setFieldsValue({
      email: site.email,
      githubUrl: site.githubUrl,
      intro: site.contact.intro || '',
    });
  }, [site, form]);

  if (loading) return <PageLoading />;
  if (!site) return <PageError message={error || '站点配置加载失败'} />;

  const handleSubmit = async (values: {
    email: string;
    githubUrl: string;
    intro: string;
  }) => {
    setSaving(true);
    try {
      setSite(
        await adminApi.updateContact(
          apiBase,
          { intro: values.intro },
          values.email,
          values.githubUrl,
        ),
      );
      message.success('联系信息已保存');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="联系我">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 520 }}
        onFinish={handleSubmit}
      >
        <Form.Item label="展示邮箱" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="GitHub 链接" name="githubUrl">
          <Input />
        </Form.Item>
        <Form.Item label="页面说明文案" name="intro">
          <TextArea rows={3} />
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
