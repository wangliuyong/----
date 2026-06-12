import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { AI_SOURCE_OPTIONS, type KnowledgeChunkQuery } from '../../../../api/ai.api';

export interface KnowledgeFilterFormProps {
  form: FormInstance<KnowledgeChunkQuery>;
  onSearch: (values: KnowledgeChunkQuery) => void;
  onReset: () => void;
  onRefresh: () => void;
}

/** 知识库筛选：数据源、关键词、查询/重置/刷新 */
export default function KnowledgeFilterForm({
  form,
  onSearch,
  onReset,
  onRefresh,
}: KnowledgeFilterFormProps) {
  return (
    <Form
      form={form}
      layout="inline"
      className="admin-filter-bar"
      onFinish={onSearch}
    >
      <Form.Item name="source" label="数据源">
        <Select
          allowClear
          placeholder="全部"
          style={{ width: 140 }}
          options={AI_SOURCE_OPTIONS}
        />
      </Form.Item>
      <Form.Item name="keyword" label="关键词">
        <Input allowClear placeholder="标题 / 正文 / ID" style={{ width: 200 }} />
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
