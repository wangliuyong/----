import { Alert, Modal } from 'antd';
import SyncCandidatePanel from './SyncCandidatePanel';
import SyncResultTable from './SyncResultTable';
import { useSyncDataModal } from './useSyncDataModal';

export interface SyncDataModalProps {
  open: boolean;
  syncing: boolean;
  onSyncingChange: (syncing: boolean) => void;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

/**
 * 向量化数据弹窗：编排候选勾选与同步提交。
 */
export default function SyncDataModal({
  open,
  syncing,
  onSyncingChange,
  onClose,
  onSuccess,
}: SyncDataModalProps) {
  const {
    activeSource,
    setActiveSource,
    selection,
    keyword,
    setKeyword,
    syncResults,
    filteredList,
    totalSelected,
    loading,
    handleSelectionChange,
    handleConfirm,
  } = useSyncDataModal({ open, onSyncingChange, onClose, onSuccess });

  return (
    <Modal
      title="选择要向量化的数据"
      open={open}
      onCancel={() => !syncing && onClose()}
      onOk={handleConfirm}
      okText={totalSelected > 0 ? `同步已选 ${totalSelected} 条` : '确定同步'}
      okButtonProps={{ disabled: totalSelected === 0 }}
      confirmLoading={syncing}
      width={720}
      destroyOnClose
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 12 }}
        message="仅对勾选的记录生成/更新向量，不会默认同步全库数据。"
      />

      <SyncCandidatePanel
        activeSource={activeSource}
        onActiveSourceChange={setActiveSource}
        selection={selection}
        onSelectionChange={handleSelectionChange}
        candidates={filteredList}
        loading={loading}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />

      {syncResults && <SyncResultTable results={syncResults} />}
    </Modal>
  );
}
