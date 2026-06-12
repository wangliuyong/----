import { useState } from 'react';
import PageLoading from '../../../components/_common/PageLoading';
import AiAssistantPageCard from './components/AiAssistantPageCard';
import AiAssistantToolbar from './components/AiAssistantToolbar';
import SyncRecordsTable from './components/SyncRecordsTable';
import VectorStatsRow from './components/VectorStatsRow';
import { useAiAssistantPage } from './hooks/useAiAssistantPage';
import { useAiConfig } from './AiConfigCard';
import SyncDataModal from './sync/SyncDataModal';

/** 路由 system/ai-assistant — 数据配置管理（按条选择向量化 + 向量统计） */
export default function AiAssistantPage() {
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const { loading, records, stats, loadData } = useAiAssistantPage();
  const aiConfig = useAiConfig({ onSaved: () => void loadData() });

  if (loading) return <PageLoading />;

  return (
    <>
      <AiAssistantPageCard
        vectorTotal={Object.values(stats).reduce((a, b) => a + b, 0)}
        syncRecordCount={records.length}
        extra={
          <AiAssistantToolbar
            configStatus={aiConfig.configStatus}
            configLoading={aiConfig.loading}
            configModalOpen={aiConfig.modalOpen}
            onOpenConfig={aiConfig.open}
            onOpenSync={() => setSyncModalOpen(true)}
          />
        }
      >
        <VectorStatsRow stats={stats} />
        <SyncRecordsTable records={records} />
      </AiAssistantPageCard>

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
