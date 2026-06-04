import { Form, Input } from 'antd';

const { TextArea } = Input;

export default function ProjectFormFields() {
  return (
    <>
      <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入名称' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="desc" label="项目描述" rules={[{ required: true, message: '请输入描述' }]}>
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item name="techStack" label="技术栈">
        <Input placeholder="React, NestJS, Docker..." />
      </Form.Item>
      <Form.Item name="githubUrl" label="GitHub URL">
        <Input />
      </Form.Item>
      <Form.Item name="previewUrl" label="预览 URL">
        <Input />
      </Form.Item>
    </>
  );
}
