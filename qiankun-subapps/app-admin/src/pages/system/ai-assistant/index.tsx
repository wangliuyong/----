import { RobotOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import {
  AI_SOURCE_OPTIONS,
  getAiStats,
  getAiSyncStatus,
  type AiSyncRecord,
} from '../../../api/ai.api';
import PageLoading from '../../../components/_common/PageLoading';
import PermissionGuard from '../../../components/PermissionGuard';
import { useAiConfig } from './AiConfigCard';
import SyncDataModal, { formatSyncRecordSources } from './SyncDataModal';

/** 路由 system/ai-assistant — 数据配置管理（按条选择向量化 + 向量统计） */
export default function AiAssistantPage() {
  const [loading, setLoading] = useState(true);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [records, setRecords] = useState<AiSyncRecord[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statusData, statsData] = await Promise.all([getAiSyncStatus(), getAiStats()]);
      setRecords(statusData);
      setStats(statsData.vectorStats);
    } finally {
      setLoading(false);
    }
  }, []);

  const aiConfig = useAiConfig({ onSaved: () => void loadData() });

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading) return <PageLoading />;

  const recordColumns: ColumnsType<AiSyncRecord> = [
    {
      title: '同步范围',
      dataIndex: 'sources',
      render: (sources: AiSyncRecord['sources']) => {
        const parts = formatSyncRecordSources(sources);
        if (!parts.length) return '-';
        return parts.map((p) => (
          <Tag key={p.label} style={{ marginBottom: 4 }}>
            {p.count > 0 ? `${p.label}(${p.count}条)` : p.label}
          </Tag>
        ));
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: string) => {
        const color = v === 'success' ? 'green' : v === 'partial' ? 'orange' : 'blue';
        return <Tag color={color}>{v}</Tag>;
      },
    },
    { title: '向量块数', dataIndex: 'chunkCount', width: 100 },
    {
      title: '开始时间',
      dataIndex: 'startedAt',
      width: 170,
      render: (v: string) => new Date(v).toLocaleString(),
    },
    {
      title: '错误',
      dataIndex: 'error',
      ellipsis: true,
      render: (v: string | null) => v ?? '-',
    },
  ];

  return (
    <>
      <Card
        title={
          <span>
            <RobotOutlined style={{ marginRight: 8 }} />
            数据配置管理
          </span>
        }
        extra={
          <Space wrap>
            {aiConfig.configStatus}
            <Button
              type="primary"
              icon={<SettingOutlined />}
              loading={aiConfig.loading && !aiConfig.modalOpen}
              onClick={aiConfig.open}
            >
              AI配置
            </Button>
            <PermissionGuard code="admin:ai-assistant:sync">
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={() => setSyncModalOpen(true)}
              >
                向量化数据
              </Button>
            </PermissionGuard>
          </Space>
        }
      >
        <Row gutter={16} style={{ marginBottom: 24 }}>
          {AI_SOURCE_OPTIONS.map((opt) => (
            <Col span={6} key={opt.value}>
              <Statistic title={opt.label} value={stats[opt.value] ?? 0} suffix="块" />
            </Col>
          ))}
        </Row>

        <Card type="inner" title="最近同步记录" size="small">
          <Table
            rowKey="id"
            columns={recordColumns}
            dataSource={records}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: '暂无同步记录' }}
          />
        </Card>
      </Card>

      <SyncDataModal
        open={syncModalOpen}
        syncing={syncing}
        onSyncingChange={setSyncing}
        onClose={() => setSyncModalOpen(false)}
        onSuccess={loadData}
      />

      {aiConfig.modal}
    </>
  );
}
