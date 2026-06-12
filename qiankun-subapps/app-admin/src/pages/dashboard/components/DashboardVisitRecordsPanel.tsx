import { GlobalOutlined } from '@ant-design/icons';
import { Card, Empty, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { DashboardOverview } from '../types';

interface DashboardVisitRecordsPanelProps {
  records: DashboardOverview['recentPageViews'];
}

const DEVICE_LABELS: Record<string, string> = {
  desktop: '桌面',
  mobile: '手机',
  tablet: '平板',
};

/** app-web 最近访问记录：IP、地区、浏览器等 */
export default function DashboardVisitRecordsPanel({ records }: DashboardVisitRecordsPanelProps) {
  const columns: ColumnsType<DashboardOverview['recentPageViews'][number]> = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      width: 148,
      render: (value: string) => dayjs(value).format('MM-DD HH:mm:ss'),
    },
    {
      title: '页面',
      dataIndex: 'path',
      width: 120,
      render: (path: string) => <code className="dashboard-visit-path">{path}</code>,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      width: 130,
      render: (ip: string | null) => ip ?? '-',
    },
    {
      title: '地区',
      dataIndex: 'region',
      ellipsis: true,
      render: (region: string | null) => region ?? '未知',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      width: 96,
      render: (browser: string | null) => browser ?? '-',
    },
    {
      title: '系统',
      dataIndex: 'os',
      width: 88,
      render: (os: string | null) => os ?? '-',
    },
    {
      title: '设备',
      dataIndex: 'device',
      width: 72,
      render: (device: string | null) =>
        device ? DEVICE_LABELS[device] ?? device : '-',
    },
    {
      title: '语言 / 时区',
      key: 'locale',
      width: 160,
      ellipsis: true,
      render: (_, row) => {
        const parts = [row.locale, row.timezone].filter(Boolean);
        return parts.length > 0 ? parts.join(' · ') : '-';
      },
    },
  ];

  return (
    <Card
      title={
        <span>
          <GlobalOutlined aria-hidden style={{ marginRight: 8, color: '#9a3412' }} />
          访问记录
        </span>
      }
      bordered={false}
      className="dashboard-panel dashboard-visit-records"
      extra={<Tag color="default">仅统计 /about · /projects · /contact · /links</Tag>}
    >
      {records.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无访问记录，浏览 app-web 页面后将自动采集"
        />
      ) : (
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={records}
          pagination={false}
          scroll={{ x: 980 }}
        />
      )}
    </Card>
  );
}
