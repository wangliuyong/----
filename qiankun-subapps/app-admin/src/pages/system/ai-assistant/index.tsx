import { RobotOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import {
  AI_SOURCE_OPTIONS,
  getAiStats,
  getAiSyncStatus,
  syncAiSources,
  type AiDataSource,
  type AiSyncRecord,
  type SourceSyncResult,
} from '../../../api/ai.api';
import PageLoading from '../../../components/_common/PageLoading';
import PermissionGuard from '../../../components/PermissionGuard';
import { useAiConfig } from './AiConfigCard';

/** 路由 system/ai-assistant — 数据配置管理（数据源同步 + 向量统计） */
export default function AiAssistantPage() {
  const [loading, setLoading] = useState(true);
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<AiDataSource[]>([
    'articles',
    'projects',
  ]);
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SourceSyncResult[] | null>(null);
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

  const handleSync = async () => {
    if (!selectedSources.length) {
      message.warning('请至少选择一个数据源');
      return;
    }
    setSyncing(true);
    setSyncResults(null);
    try {
      const res = await syncAiSources(selectedSources);
      setSyncResults(res.results);
      const failed = res.results.filter((r) => r.error);
      if (failed.length) {
        message.error(`同步失败：${failed.map((r) => `${r.source}: ${r.error}`).join('；')}`);
      } else if (res.chunkCount === 0) {
        message.warning('同步完成，但未产生向量块（数据源可能为空）');
        setSyncModalOpen(false)
      } else {
        message.success(`同步完成，共写入 ${res.chunkCount} 个向量块`);
        setSyncModalOpen(false)
      }
      await loadData();
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <PageLoading />;

  const recordColumns: ColumnsType<AiSyncRecord> = [
    {
      title: '数据源',
      dataIndex: 'sources',
      render: (sources: string[]) =>
        sources.map((s) => {
          const opt = AI_SOURCE_OPTIONS.find((o) => o.value === s);
          return (
            <Tag key={s} style={{ marginBottom: 4 }}>
              {opt?.label ?? s}
            </Tag>
          );
        }),
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

  const resultColumns: ColumnsType<SourceSyncResult> = [
    {
      title: '数据源',
      dataIndex: 'source',
      render: (s: AiDataSource) => AI_SOURCE_OPTIONS.find((o) => o.value === s)?.label ?? s,
    },
    { title: '向量块数', dataIndex: 'chunkCount', width: 100 },
    {
      title: '错误',
      dataIndex: 'error',
      render: (v?: string) => (v ? <Tag color="red">{v}</Tag> : '-'),
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
                onClick={() => {
                  setSyncResults(null);
                  setSyncModalOpen(true);
                }}
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

      <Modal
        title="选择数据源同步"
        open={syncModalOpen}
        onCancel={() => !syncing && setSyncModalOpen(false)}
        onOk={handleSync}
        okText="确定同步"
        confirmLoading={syncing}
        width={480}
      >
        <p style={{ marginBottom: 12, color: '#666' }}>
          选择要向量化的数据源，同步后将写入 LanceDB 向量库供 AI 小助手检索。
        </p>
        <Checkbox.Group
          options={AI_SOURCE_OPTIONS}
          value={selectedSources}
          onChange={(vals) => setSelectedSources(vals as AiDataSource[])}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        />
        {syncResults && (
          <Table
            style={{ marginTop: 16 }}
            rowKey="source"
            size="small"
            columns={resultColumns}
            dataSource={syncResults}
            pagination={false}
          />
        )}
      </Modal>

      {aiConfig.modal}
    </>
  );
}
