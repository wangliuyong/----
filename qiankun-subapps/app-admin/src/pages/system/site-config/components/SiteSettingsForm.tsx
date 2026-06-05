import { Button, Form, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { SiteConfig } from '../../../../types';

export interface SiteSettingsFormProps {
  form: FormInstance;
  saving: boolean;
  onSubmit: (values: Partial<SiteConfig>) => void;
}

/** 站点基础信息表单 */
export default function SiteSettingsForm({ form, saving, onSubmit }: SiteSettingsFormProps) {
  return (
    <Form form={form} layout="vertical" style={{ maxWidth: 520 }} onFinish={onSubmit}>
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
          保存站点设置
        </Button>
      </Form.Item>
    </Form>
  );
}
