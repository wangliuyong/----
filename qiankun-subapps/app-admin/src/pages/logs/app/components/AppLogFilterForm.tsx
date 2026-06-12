import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { AppLogQuery } from '../../../../api/logs.api';

export interface AppLogFilterFormProps {
  form: FormInstance<AppLogQuery>;
  onSearch: (values: AppLogQuery) => void;
  onReset: () => void;
  onRefresh: () => void;
}

/** 应用日志筛选表单 */
export default function AppLogFilterForm({
  form,
  onSearch,
  onReset,
  onRefresh,
}: AppLogFilterFormProps) {
  return (
    <Form form={form} layout="inline" className="admin-filter-bar" onFinish={onSearch}>
      <Form.Item name="keyword" label="关键词">
        <Input allowClear placeholder="搜索消息内容" style={{ width: 200 }} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button onClick={onReset} icon={<ReloadOutlined />}>
            重置
          </Button>
          <Button onClick={onRefresh} icon={<ReloadOutlined />}>
            刷新
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
