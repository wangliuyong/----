import { CloudServerOutlined } from '@ant-design/icons';
import { Card, Descriptions, Progress, Tag } from 'antd';
import type { DashboardOverview } from '../types';
import { formatBytes, formatUptime } from '../utils/formatters';

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

  return (
    <Card
      title={
        <>
          <CloudServerOutlined /> 服务器信息
        </>
      }
      bordered={false}
      className="dashboard-panel"
    >
      <Descriptions column={{ xs: 1, sm: 2 }} size="small">
        <Descriptions.Item label="主机名">{server.hostname}</Descriptions.Item>
        <Descriptions.Item label="运行环境">
          <Tag>{server.env}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="系统">{server.platform}</Descriptions.Item>
        <Descriptions.Item label="架构">{server.arch}</Descriptions.Item>
        <Descriptions.Item label="Node">{server.nodeVersion}</Descriptions.Item>
        <Descriptions.Item label="进程运行">{formatUptime(server.uptimeSeconds)}</Descriptions.Item>
        <Descriptions.Item label="进程内存">{server.memory.rssMb} MB (RSS)</Descriptions.Item>
        <Descriptions.Item label="数据库大小">
          {formatBytes(server.databaseSizeBytes)}
        </Descriptions.Item>
      </Descriptions>

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

      <Descriptions column={1} size="small" title="AI 小助手" className="dashboard-server-ai">
        <Descriptions.Item label="配置状态">
          <Tag color={ai.configured ? 'success' : 'default'}>
            {ai.configured ? '已配置' : '未配置'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="向量块数">{ai.vectorChunkCount}</Descriptions.Item>
        <Descriptions.Item label="最近同步">
          {ai.lastSyncAt ? (
            <>
              <Tag color={syncStatusColor}>{ai.lastSyncStatus ?? '未知'}</Tag>
              <span className="dashboard-muted">{ai.lastSyncAt.slice(0, 19).replace('T', ' ')}</span>
            </>
          ) : (
            '暂无记录'
          )}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
