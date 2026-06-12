import { Form, Input, Switch } from 'antd';

/** 公告表单字段 */
export default function ConvNoticeFormFields() {
  return (
    <>
      <Form.Item name="title" label="标题" rules={[{ required: true, message: '请填写标题' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="content" label="内容" rules={[{ required: true, message: '请填写内容' }]}>
        <Input.TextArea rows={6} />
      </Form.Item>
      <Form.Item name="published" label="发布" valuePropName="checked" initialValue>
        <Switch />
      </Form.Item>
    </>
  );
}

export const CONV_NOTICE_COLUMNS = [
  { title: 'ID', dataIndex: 'id', width: 72 },
  { title: '标题', dataIndex: 'title', ellipsis: true },
  {
    title: '已发布',
    dataIndex: 'published',
    width: 88,
    render: (v: boolean) => (v ? '是' : '否'),
  },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
];
