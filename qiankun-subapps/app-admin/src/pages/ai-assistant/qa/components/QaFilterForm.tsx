import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { AiChatSessionQuery } from '../../../../api/ai.api';

export interface QaFilterFormProps {
  form: FormInstance<AiChatSessionQuery>;
  onSearch: (values: AiChatSessionQuery) => void;
  onReset: () => void;
  onRefresh: () => void;
}

/** 用户问答筛选：关键词、查询/重置/刷新 */
export default function QaFilterForm({
  form,
  onSearch,
  onReset,
  onRefresh,
}: QaFilterFormProps) {
  return (
    <Form
      form={form}
      layout="inline"
      className="admin-filter-bar"
      onFinish={onSearch}
    >
      <Form.Item name="keyword" label="关键词">
        <Input allowClear placeholder="问题 / 回答 / 会话 ID" style={{ width: 240 }} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button onClick={onReset}>重置</Button>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            刷新
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
