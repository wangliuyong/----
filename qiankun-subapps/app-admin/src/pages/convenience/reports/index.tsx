import {
  AlertOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useMemo } from 'react';
import { AdminPageShell, AdminSectionCard } from '../../../components/admin-page';
import PageLoading from '../../../components/_common/PageLoading';
import ReportDetailModal from './components/ReportDetailModal';
import ReportFilterForm from './components/ReportFilterForm';
import ReportTable from './components/ReportTable';
import ReportTypeBreakdown from './components/ReportTypeBreakdown';
import { REPORT_TYPE_CONFIG, type ReportTypeKey } from './constants';
import { useReportsPage } from './hooks/useReportsPage';
import './styles/reports.scss';

/** 路由 convenience/reports — 举报管理 */
export default function ConvReportsPage() {
  const page = useReportsPage();

  const columnHandlers = useMemo(
    () => ({
      onViewDetail: page.setDetail,
      onDelete: (id: number) => void page.handleDelete(id),
    }),
    [page.setDetail, page.handleDelete],
  );

  if (page.loading && !page.data) return <PageLoading />;

  const activeType = page.filters.reportType;
  const activeLabel = activeType ? REPORT_TYPE_CONFIG[activeType as ReportTypeKey]?.label : '全部';
  const highRiskCount =
    (page.typeStats.byType.FRAUD ?? 0) + (page.typeStats.byType.ILLEGAL ?? 0);

  return (
    <>
      <AdminPageShell
        title="举报管理"
        description="用户提交的便民信息举报，按类型分布快速定位，核实后可归档删除"
        stats={[
          {
            label: '举报总数',
            value: page.typeStats.total,
            icon: <AlertOutlined />,
            accent: 'warning',
          },
          {
            label: '欺诈 + 违法',
            value: highRiskCount,
            icon: <ExclamationCircleOutlined />,
            accent: highRiskCount > 0 ? 'danger' : 'default',
            hint: highRiskCount > 0 ? '建议优先处理' : '暂无高风险',
          },
          {
            label: '当前筛选',
            value: dataMatchLabel(page.data?.total, activeLabel),
            icon: <UnorderedListOutlined />,
            accent: 'primary',
            hint: activeType ? `类型：${activeLabel}` : '显示全部类型',
          },
          {
            label: '信息可追溯',
            value: 'ID 关联',
            icon: <SafetyCertificateOutlined />,
            hint: '点击详情查看完整上下文',
          },
        ]}
      >
        <AdminSectionCard noPadding>
          <ReportTypeBreakdown
            stats={page.typeStats}
            loading={page.statsLoading}
            activeType={activeType}
            onTypeClick={page.handleTypeFilter}
          />

          <div style={{ padding: '0 16px 16px' }}>
            <ReportFilterForm
              form={page.filterForm}
              loading={page.loading || page.statsLoading}
              onSearch={page.handleSearch}
              onReset={page.handleReset}
              onRefresh={() => void page.reloadAll()}
            />

            <ReportTable
              loading={page.loading}
              list={page.data?.list ?? []}
              total={page.data?.total ?? 0}
              page={page.filters.page ?? 1}
              pageSize={page.filters.pageSize ?? 10}
              onTableChange={page.handleTableChange}
              columnHandlers={columnHandlers}
            />
          </div>
        </AdminSectionCard>
      </AdminPageShell>

      <ReportDetailModal
        record={page.detail}
        onClose={() => page.setDetail(null)}
        onDelete={page.handleDelete}
      />
    </>
  );
}

/** 当前筛选结果展示文案 */
function dataMatchLabel(total: number | undefined, activeLabel: string): string {
  if (total === undefined) return '-';
  return activeLabel === '全部' ? `${total} 条` : `${total} 条匹配`;
}
