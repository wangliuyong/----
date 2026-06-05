import { HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';
import { SECTION_LABELS, type DashboardSectionId } from '../config/sectionTypes';

interface DashboardSortableSectionProps {
  id: DashboardSectionId;
  isEditing: boolean;
  children: ReactNode;
}

/** 单个可拖拽卡片区块外壳 */
export default function DashboardSortableSection({
  id,
  isEditing,
  children,
}: DashboardSortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled: !isEditing,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'dashboard-section',
        isEditing && 'dashboard-section--editing',
        isDragging && 'dashboard-section--dragging',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isEditing && (
        <div className="dashboard-section__toolbar">
          <button
            type="button"
            className="dashboard-section__handle"
            aria-label={`拖动排序：${SECTION_LABELS[id]}`}
            {...attributes}
            {...listeners}
          >
            <HolderOutlined />
            <span>{SECTION_LABELS[id]}</span>
          </button>
        </div>
      )}
      <div className="dashboard-section__body">{children}</div>
    </div>
  );
}
