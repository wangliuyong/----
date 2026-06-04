import { Form, Input, Select } from 'antd';

/** 角色新建/编辑表单字段 */
export default function RoleCrudFormFields() {
  return (
    <>
      <Form.Item name="name" label="名称" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="code" label="编码" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="描述">
        <Input.TextArea rows={2} />
      </Form.Item>
      <Form.Item name="status" label="状态" initialValue={1}>
        <Select
          options={[
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 },
          ]}
        />
      </Form.Item>
    </>
  );
}
