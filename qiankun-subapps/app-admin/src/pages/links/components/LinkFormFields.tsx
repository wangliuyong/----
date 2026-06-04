import { Form, Input, InputNumber } from 'antd';

export default function LinkFormFields() {
  return (
    <>
      <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="url" label="链接" rules={[{ required: true, message: '请输入 URL' }]}>
        <Input placeholder="https://..." />
      </Form.Item>
      <Form.Item name="description" label="描述">
        <Input />
      </Form.Item>
      <Form.Item name="avatar" label="头像 URL">
        <Input placeholder="https://..." />
      </Form.Item>
      <Form.Item name="sort" label="排序（越小越靠前）" initialValue={0}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
}
