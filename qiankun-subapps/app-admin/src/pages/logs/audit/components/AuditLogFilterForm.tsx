import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { AuditLogQuery } from '../../../../api/logs.api';

export interface AuditLogFilterFormProps {
  form: FormInstance<AuditLogQuery>;
  onSearch: (values: AuditLogQuery) => void;
  onReset: () => void;
  onRefresh: () => void;
}

/** 审计日志筛选表单 */
export default function AuditLogFilterForm({
  form,
  onSearch,
  onReset,
  onRefresh,
}: AuditLogFilterFormProps) {
  return (
    <Form form={form} layout="inline" className="admin-filter-bar" onFinish={onSearch}>
      <Form.Item name="action" label="操作类型">
        <Select
          allowClear
          placeholder="全部"
          style={{ width: 120 }}
          options={[
            { label: '新建', value: 'create' },
            { label: '编辑', value: 'update' },
            { label: '删除', value: 'delete' },
            { label: '登录', value: 'login' },
          ]}
        />
      </Form.Item>
      <Form.Item name="username" label="操作人">
        <Input allowClear placeholder="用户名" style={{ width: 140 }} />
      </Form.Item>
      <Form.Item name="module" label="模块">
        <Input allowClear placeholder="模块路径" style={{ width: 160 }} />
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
