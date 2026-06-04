import { Form, Input, Select } from 'antd';

/** 用户新建/编辑表单字段 */
export default function UserCrudFormFields() {
  return (
    <>
      <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[{ min: 6, message: '至少 6 位' }]}
        extra="编辑用户时留空表示不修改密码"
      >
        <Input.Password />
      </Form.Item>
      <Form.Item name="nickname" label="昵称">
        <Input />
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
