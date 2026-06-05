import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { updateContact } from '../../../../api/site.api';
import type { SiteConfig } from '../../../../types';

const { TextArea } = Input;

export interface SiteContactSettingsSectionProps {
  site: SiteConfig;
  setSite: (site: SiteConfig) => void;
}

/** 站点配置 Tab：联系页文案与邮箱 */
export default function SiteContactSettingsSection({
  site,
  setSite,
}: SiteContactSettingsSectionProps) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      email: site.email,
      githubUrl: site.githubUrl,
      intro: site.contact.intro || '',
    });
  }, [site, form]);

  const handleSubmit = async (values: {
    email: string;
    githubUrl: string;
    intro: string;
  }) => {
    setSaving(true);
    try {
      setSite(
        await updateContact(
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
          保存联系信息
        </Button>
      </Form.Item>
    </Form>
  );
}
