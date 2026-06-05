import { CloudServerOutlined } from '@ant-design/icons';
import { Card, Progress, Tag } from 'antd';
import type { DashboardOverview } from '../types';
import { formatBytes, formatUptime } from '../utils/formatters';
import DashboardKvList, { type DashboardKvItem } from './DashboardKvList';

interface DashboardServerPanelProps {
  server: DashboardOverview['server'];
  ai: DashboardOverview['ai'];
}

/** 服务器运行时与 AI 同步状态 */
export default function DashboardServerPanel({ server, ai }: DashboardServerPanelProps) {
  const memoryPercent = Math.round((server.memory.usedMb / server.memory.totalMb) * 100);

  const syncStatusColor =
    ai.lastSyncStatus === 'success'
      ? 'success'
      : ai.lastSyncStatus === 'partial'
        ? 'warning'
        : ai.lastSyncStatus === 'running'
          ? 'processing'
          : 'default';

  const serverItems: DashboardKvItem[] = [
    { key: 'hostname', label: '主机名', value: server.hostname, breakValue: true },
    { key: 'env', label: '运行环境', value: <Tag>{server.env}</Tag>, wrapValue: true },
    { key: 'platform', label: '系统', value: server.platform, breakValue: true },
    { key: 'arch', label: '架构', value: server.arch },
    { key: 'node', label: 'Node', value: server.nodeVersion },
    { key: 'uptime', label: '进程运行', value: formatUptime(server.uptimeSeconds) },
    { key: 'rss', label: '进程内存', value: `${server.memory.rssMb} MB (RSS)` },
    { key: 'db', label: '数据库大小', value: formatBytes(server.databaseSizeBytes) },
  ];

  const aiItems: DashboardKvItem[] = [
    {
      key: 'configured',
      label: '配置状态',
      value: (
        <Tag color={ai.configured ? 'success' : 'default'}>
          {ai.configured ? '已配置' : '未配置'}
        </Tag>
      ),
      wrapValue: true,
    },
    { key: 'chunks', label: '向量块数', value: ai.vectorChunkCount, emphasize: true },
    {
      key: 'sync',
      label: '最近同步',
      value: ai.lastSyncAt ? (
        <span className="dashboard-kv__inline">
          <Tag color={syncStatusColor}>{ai.lastSyncStatus ?? '未知'}</Tag>
          <span className="dashboard-muted">{ai.lastSyncAt.slice(0, 19).replace('T', ' ')}</span>
        </span>
      ) : (
        '暂无记录'
      ),
      wrapValue: true,
    },
  ];

  return (
    <Card
      title={
        <>
          <CloudServerOutlined /> 服务器信息
        </>
      }
      bordered={false}
      className="dashboard-panel dashboard-server-panel"
    >
      <DashboardKvList items={serverItems} />

      <div className="dashboard-server-memory">
        <div className="dashboard-server-memory__label">
          系统内存 {server.memory.usedMb} / {server.memory.totalMb} MB
        </div>
        <Progress
          percent={memoryPercent}
          status={memoryPercent > 85 ? 'exception' : 'normal'}
          strokeColor={memoryPercent > 85 ? undefined : '#b45309'}
        />
      </div>

      <div className="dashboard-server-ai">
        <div className="dashboard-server-ai__title">AI 小助手</div>
        <DashboardKvList items={aiItems} />
      </div>
    </Card>
  );
}
