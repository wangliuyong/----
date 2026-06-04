import { Form, Input } from 'antd';

const { TextArea } = Input;

/** 文章新建/编辑表单字段 */
export default function ArticleFormFields() {
  return (
    <>
      <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="summary" label="摘要">
        <Input />
      </Form.Item>
      <Form.Item name="category" label="分类">
        <Input />
      </Form.Item>
      <Form.Item name="tags" label="标签（逗号分隔）">
        <Input />
      </Form.Item>
      <Form.Item
        name="content"
        label="正文（Markdown）"
        rules={[{ required: true, message: '请输入正文' }]}
      >
        <TextArea rows={10} />
      </Form.Item>
    </>
  );
}
