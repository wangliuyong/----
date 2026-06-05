import {
  EyeOutlined,
  FireOutlined,
  MessageOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { Card, Tag } from 'antd';
import dayjs from 'dayjs';
import type { DashboardOverview } from '../types';
import { formatDayDelta, truncateText } from '../utils/formatters';
import DashboardKvList from './DashboardKvList';

interface DashboardInteractionPanelProps {
  interaction: DashboardOverview['interaction'];
  logs: DashboardOverview['logs'];
  messagesTotal: number;
}

/** 带较昨日变化的数值展示 */
function ValueWithDelta({ value, today, yesterday }: { value: number; today: number; yesterday: number }) {
  return (
    <span className="dashboard-interaction-metric">
      <span className="dashboard-interaction-metric__num">{value}</span>
      <span className="dashboard-interaction-metric__delta">{formatDayDelta(today, yesterday)}</span>
    </span>
  );
}

/** 留言、AI 问答、访问与系统日志摘要 */
export default function DashboardInteractionPanel({
  interaction,
  logs,
  messagesTotal,
}: DashboardInteractionPanelProps) {
  const messageRate =
    interaction.pageViewsToday > 0
      ? `${((interaction.messagesToday / interaction.pageViewsToday) * 100).toFixed(1)}%`
      : null;

  const messageItems = [
    {
      key: 'today',
      label: '今日新增',
      value: (
        <ValueWithDelta
          value={interaction.messagesToday}
          today={interaction.messagesToday}
          yesterday={interaction.messagesYesterday}
        />
      ),
      wrapValue: true,
    },
    { key: 'week', label: '本周新增', value: interaction.messagesThisWeek, emphasize: true },
    { key: 'total', label: '累计留言', value: messagesTotal, emphasize: true },
  ];

  const aiItems = [
    { key: 'today', label: '今日会话', value: interaction.aiSessionsToday, emphasize: true },
    { key: 'week', label: '本周会话', value: interaction.aiSessionsThisWeek, emphasize: true },
    { key: 'sessions', label: '累计会话', value: interaction.aiSessions, emphasize: true },
    { key: 'messages', label: '累计消息', value: interaction.aiMessages, emphasize: true },
    {
      key: 'avg',
      label: '场均消息',
      value: interaction.aiAvgMessagesPerSession ?? '-',
      emphasize: true,
    },
  ];

  const visitItems = [
    {
      key: 'today',
      label: '今日 PV',
      value: (
        <ValueWithDelta
          value={interaction.pageViewsToday}
          today={interaction.pageViewsToday}
          yesterday={interaction.pageViewsYesterday}
        />
      ),
      wrapValue: true,
    },
    { key: 'week', label: '本周 PV', value: interaction.pageViewsThisWeek, emphasize: true },
    {
      key: 'rate',
      label: '留言转化',
      value: messageRate ?? '暂无访问',
      wrapValue: true,
    },
  ];

  return (
    <Card title="互动概览" bordered={false} className="dashboard-panel dashboard-interaction-panel">
      <div className="dashboard-interaction-summary">
        <div className="dashboard-interaction-summary__item">
          <span className="dashboard-interaction-summary__label">今日访问</span>
          <span className="dashboard-interaction-summary__value">{interaction.pageViewsToday}</span>
        </div>
        <div className="dashboard-interaction-summary__item">
          <span className="dashboard-interaction-summary__label">今日留言</span>
          <span className="dashboard-interaction-summary__value">{interaction.messagesToday}</span>
        </div>
        <div className="dashboard-interaction-summary__item">
          <span className="dashboard-interaction-summary__label">AI 会话</span>
          <span className="dashboard-interaction-summary__value">{interaction.aiSessionsToday}</span>
        </div>
      </div>

      <div className="dashboard-interaction-grid dashboard-interaction-grid--triple">
        <section className="dashboard-interaction-section">
          <h4 className="dashboard-interaction-section__title">
            <MessageOutlined aria-hidden />
            留言
          </h4>
          <DashboardKvList items={messageItems} />
        </section>

        <section className="dashboard-interaction-section">
          <h4 className="dashboard-interaction-section__title">
            <RobotOutlined aria-hidden />
            AI 问答
          </h4>
          <DashboardKvList items={aiItems} />
        </section>

        <section className="dashboard-interaction-section">
          <h4 className="dashboard-interaction-section__title">
            <EyeOutlined aria-hidden />
            站点访问
          </h4>
          <DashboardKvList items={visitItems} />
        </section>
      </div>

      <div className="dashboard-interaction-insights">
        <div className="dashboard-interaction-insight">
          <div className="dashboard-interaction-insight__label">最新留言</div>
          {interaction.latestMessage ? (
            <>
              <div className="dashboard-interaction-insight__title">
                {interaction.latestMessage.nickname}
              </div>
              <div className="dashboard-interaction-insight__body">
                {truncateText(interaction.latestMessage.content, 64)}
              </div>
              <div className="dashboard-muted">
                {dayjs(interaction.latestMessage.createdAt).format('YYYY-MM-DD HH:mm')}
              </div>
            </>
          ) : (
            <div className="dashboard-interaction-insight__empty">暂无留言</div>
          )}
        </div>

        <div className="dashboard-interaction-insight">
          <div className="dashboard-interaction-insight__label">
            <FireOutlined aria-hidden /> 本周热门页
          </div>
          {interaction.topPageThisWeek ? (
            <>
              <div className="dashboard-interaction-insight__title dashboard-interaction-insight__path">
                {interaction.topPageThisWeek.path}
              </div>
              <div className="dashboard-interaction-insight__body">
                本周 {interaction.topPageThisWeek.views} 次访问
              </div>
            </>
          ) : (
            <div className="dashboard-interaction-insight__empty">暂无访问记录</div>
          )}
        </div>
      </div>

      <div className="dashboard-interaction-logs">
        <div className="dashboard-interaction-logs__title">系统日志</div>
        <div className="dashboard-interaction-logs__tags">
          <Tag color="blue">今日审计 {logs.auditToday} 条</Tag>
          <Tag color={logs.appErrorsToday > 0 ? 'error' : 'success'}>
            今日错误 {logs.appErrorsToday} 条
          </Tag>
          <Tag color={logs.appErrorsThisWeek > 0 ? 'warning' : 'default'}>
            本周错误 {logs.appErrorsThisWeek} 条
          </Tag>
        </div>
      </div>
    </Card>
  );
}
