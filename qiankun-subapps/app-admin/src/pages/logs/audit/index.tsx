import { AuditOutlined, FileSearchOutlined } from '@ant-design/icons';
import { useMemo, useState } from 'react';
import { listAuditLogs, type AuditLog } from '../../../api/logs.api';
import PageLoading from '../../../components/_common/PageLoading';
import LogListCard from '../_shared/components/LogListCard';
import { usePaginatedLogList } from '../_shared/hooks/usePaginatedLogList';
import AuditLogDetailModal from './components/AuditLogDetailModal';
import AuditLogFilterForm from './components/AuditLogFilterForm';
import AuditLogTable from './components/AuditLogTable';

/** 路由 logs/audit — 操作审计日志 */
export default function AuditLogsPage() {
  const [detailRecord, setDetailRecord] = useState<AuditLog | null>(null);
  const list = usePaginatedLogList(listAuditLogs);

  const columnHandlers = useMemo(
    () => ({ onViewDetail: setDetailRecord }),
    [],
  );

  if (list.loading && !list.data) return <PageLoading />;

  return (
    <>
      <LogListCard
        title="操作审计日志"
        description="记录后台用户的创建、编辑、删除与登录等关键操作，便于追溯"
        stats={[
          {
            label: '日志总数',
            value: list.data?.total ?? 0,
            icon: <AuditOutlined />,
            accent: 'primary',
          },
          {
            label: '当前页',
            value: list.data?.items.length ?? 0,
            icon: <FileSearchOutlined />,
            hint: `第 ${list.data?.page ?? 1} 页`,
          },
        ]}
      >
        <AuditLogFilterForm
          form={list.form}
          onSearch={list.handleSearch}
          onReset={list.handleReset}
          onRefresh={list.handleRefresh}
        />
        <AuditLogTable
          loading={list.loading}
          data={list.data}
          onTableChange={list.handleTableChange}
          columnHandlers={columnHandlers}
        />
      </LogListCard>

      <AuditLogDetailModal record={detailRecord} onClose={() => setDetailRecord(null)} />
    </>
  );
}
