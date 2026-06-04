import { useMemo, useState } from 'react';
import { listAppLogs, type AppLog } from '../../../api/logs.api';
import PageLoading from '../../../components/_common/PageLoading';
import LogListCard from '../_shared/components/LogListCard';
import { usePaginatedLogList } from '../_shared/hooks/usePaginatedLogList';
import AppLogDetailModal from './components/AppLogDetailModal';
import AppLogFilterForm from './components/AppLogFilterForm';
import AppLogTable from './components/AppLogTable';

/** 路由 logs/app — 应用错误日志 */
export default function AppLogsPage() {
  const [detailRecord, setDetailRecord] = useState<AppLog | null>(null);
  const list = usePaginatedLogList(listAppLogs);

  const columnHandlers = useMemo(
    () => ({ onViewDetail: setDetailRecord }),
    [],
  );

  if (list.loading && !list.data) return <PageLoading />;

  return (
    <>
      <LogListCard title="应用错误日志">
        <AppLogFilterForm
          form={list.form}
          onSearch={list.handleSearch}
          onReset={list.handleReset}
          onRefresh={list.handleRefresh}
        />
        <AppLogTable
          loading={list.loading}
          data={list.data}
          onTableChange={list.handleTableChange}
          columnHandlers={columnHandlers}
        />
      </LogListCard>

      <AppLogDetailModal record={detailRecord} onClose={() => setDetailRecord(null)} />
    </>
  );
}
