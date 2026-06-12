import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Select, Space } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ConvReportQuery } from '../../../../types/convenience';
import { DEFAULT_REPORT_QUERY, REPORT_TYPE_OPTIONS } from '../constants';

export interface ReportFilterFormProps {
  form: FormInstance<ConvReportQuery>;
  loading?: boolean;
  onSearch: (values: ConvReportQuery) => void;
  onReset: () => void;
  onRefresh: () => void;
}

/** 举报列表筛选：按举报类型查询 */
export default function ReportFilterForm({
  form,
  loading,
  onSearch,
  onReset,
  onRefresh,
}: ReportFilterFormProps) {
  return (
    <Form
      form={form}
      layout="inline"
      className="admin-filter-bar"
      initialValues={DEFAULT_REPORT_QUERY}
      onFinish={onSearch}
    >
      <Form.Item name="reportType" label="举报类型">
        <Select
          allowClear
          placeholder="全部类型"
          style={{ width: 140 }}
          options={REPORT_TYPE_OPTIONS}
        />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            查询
          </Button>
          <Button onClick={onReset}>重置</Button>
          <Button icon={<ReloadOutlined />} loading={loading} onClick={onRefresh}>
            刷新
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
