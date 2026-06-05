import { RobotOutlined, MessageOutlined } from '@ant-design/icons';
import { Card, Col, Descriptions, Row, Tag } from 'antd';
import type { DashboardOverview } from '../types';

interface DashboardInteractionPanelProps {
  interaction: DashboardOverview['interaction'];
  logs: DashboardOverview['logs'];
  messagesTotal: number;
}

/** 互动与访问相关指标（基于留言、AI 问答与审计，非独立 PV 埋点） */
export default function DashboardInteractionPanel({
  interaction,
  logs,
  messagesTotal,
}: DashboardInteractionPanelProps) {
  return (
    <Card title="互动与访问" bordered={false} className="dashboard-panel">
      <p className="dashboard-panel__hint">
        当前以留言、AI 问答与后台操作为互动指标。如需完整 PV/UV 统计，可后续接入访问埋点。
      </p>
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Descriptions column={1} size="small" title={<><MessageOutlined /> 留言</>}>
            <Descriptions.Item label="今日新增">{interaction.messagesToday}</Descriptions.Item>
            <Descriptions.Item label="本周新增">{interaction.messagesThisWeek}</Descriptions.Item>
            <Descriptions.Item label="累计">{messagesTotal}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} md={12}>
          <Descriptions column={1} size="small" title={<><RobotOutlined /> AI 问答</>}>
            <Descriptions.Item label="今日会话">{interaction.aiSessionsToday}</Descriptions.Item>
            <Descriptions.Item label="本周会话">{interaction.aiSessionsThisWeek}</Descriptions.Item>
            <Descriptions.Item label="累计会话">{interaction.aiSessions}</Descriptions.Item>
            <Descriptions.Item label="累计消息">{interaction.aiMessages}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <div className="dashboard-panel__tags">
        <Tag color="blue">今日审计 {logs.auditToday} 条</Tag>
        <Tag color={logs.appErrorsToday > 0 ? 'error' : 'success'}>
          今日错误 {logs.appErrorsToday} 条
        </Tag>
        <Tag color={logs.appErrorsThisWeek > 0 ? 'warning' : 'default'}>
          本周错误 {logs.appErrorsThisWeek} 条
        </Tag>
      </div>
    </Card>
  );
}
