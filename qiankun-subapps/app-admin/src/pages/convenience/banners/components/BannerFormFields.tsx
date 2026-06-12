import { Form, Input, InputNumber, Switch } from 'antd';

/** 轮播图表单字段 */
export default function ConvBannerFormFields() {
  return (
    <>
      <Form.Item name="imageUrl" label="图片 URL" rules={[{ required: true, message: '请填写图片地址' }]}>
        <Input placeholder="/api/upload/image/1 或完整 URL" />
      </Form.Item>
      <Form.Item name="linkUrl" label="跳转链接">
        <Input placeholder="选填" />
      </Form.Item>
      <Form.Item name="sort" label="排序" initialValue={0}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="online" label="上线" valuePropName="checked" initialValue>
        <Switch />
      </Form.Item>
    </>
  );
}

export const CONV_BANNER_COLUMNS = [
  { title: 'ID', dataIndex: 'id', width: 72 },
  { title: '图片', dataIndex: 'imageUrl', ellipsis: true },
  { title: '链接', dataIndex: 'linkUrl', ellipsis: true },
  { title: '排序', dataIndex: 'sort', width: 80 },
  {
    title: '上线',
    dataIndex: 'online',
    width: 80,
    render: (v: boolean) => (v ? '是' : '否'),
  },
];
