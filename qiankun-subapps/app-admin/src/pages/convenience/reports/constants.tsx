import {
  AlertOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';
import type { ConvReportQuery } from '../../../types/convenience';

/** 举报类型枚举 */
export type ReportTypeKey = NonNullable<ConvReportQuery['reportType']>;

/** 举报类型展示配置 */
export interface ReportTypeConfig {
  label: string;
  color: string;
  icon: ReactNode;
  /** 统计卡片强调色 */
  accent: 'default' | 'warning' | 'success' | 'danger' | 'primary';
  description: string;
}

/** 举报类型映射：标签、颜色、图标与说明 */
export const REPORT_TYPE_CONFIG: Record<ReportTypeKey, ReportTypeConfig> = {
  SPAM: {
    label: '垃圾信息',
    color: 'gold',
    icon: <StopOutlined />,
    accent: 'warning',
    description: '重复发布、广告灌水等低质量内容',
  },
  FRAUD: {
    label: '欺诈',
    color: 'red',
    icon: <ExclamationCircleOutlined />,
    accent: 'danger',
    description: '涉嫌诈骗、虚假交易或误导性信息',
  },
  ILLEGAL: {
    label: '违法',
    color: 'magenta',
    icon: <AlertOutlined />,
    accent: 'danger',
    description: '违反法律法规或平台禁止发布的内容',
  },
  OTHER: {
    label: '其他',
    color: 'default',
    icon: <QuestionCircleOutlined />,
    accent: 'default',
    description: '未归入以上类别的其他举报原因',
  },
};

export const REPORT_TYPE_OPTIONS = (Object.keys(REPORT_TYPE_CONFIG) as ReportTypeKey[]).map(
  (key) => ({
    value: key,
    label: REPORT_TYPE_CONFIG[key].label,
  }),
);

/** 被举报信息的审核状态 */
export const INFO_AUDIT_STATUS_MAP = {
  PENDING: { label: '待审核', color: 'gold' },
  APPROVED: { label: '已通过', color: 'green' },
  REJECTED: { label: '已驳回', color: 'red' },
} as const;

export const DEFAULT_REPORT_QUERY: ConvReportQuery = { page: 1, pageSize: 10 };

/** 各类型举报数量汇总 */
export interface ReportTypeStats {
  total: number;
  byType: Record<ReportTypeKey, number>;
}

export const EMPTY_REPORT_TYPE_STATS: ReportTypeStats = {
  total: 0,
  byType: { SPAM: 0, FRAUD: 0, ILLEGAL: 0, OTHER: 0 },
};

/** 页面空状态文案 */
export const REPORT_EMPTY_HINT = '暂无举报记录，用户提交后将在此展示';
