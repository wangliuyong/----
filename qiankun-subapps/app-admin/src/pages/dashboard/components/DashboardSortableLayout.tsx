import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { DashboardSectionId } from '../config/sectionTypes';
import type { DashboardOverview } from '../types';
import DashboardSectionRenderer from './DashboardSectionRenderer';
import DashboardSortableSection from './DashboardSortableSection';

interface DashboardSortableLayoutProps {
  order: DashboardSectionId[];
  isEditing: boolean;
  overview: DashboardOverview;
  onNavigate: (path: string) => void;
  onReorder: (next: DashboardSectionId[]) => void;
}

/**
 * 首页卡片垂直拖拽排序容器。
 * 编辑模式下拖动手柄调整区块顺序，顺序持久化到 localStorage。
 */
export default function DashboardSortableLayout({
  order,
  isEditing,
  overview,
  onNavigate,
  onReorder,
}: DashboardSortableLayoutProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id as DashboardSectionId);
    const newIndex = order.indexOf(over.id as DashboardSectionId);
    if (oldIndex < 0 || newIndex < 0) return;

    onReorder(arrayMove(order, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div
          className={[
            'dashboard-sections',
            isEditing && 'dashboard-sections--editing',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {isEditing && (
            <p className="dashboard-sections__hint">拖动手柄可调整卡片顺序</p>
          )}
          {order.map((sectionId) => (
            <DashboardSortableSection key={sectionId} id={sectionId} isEditing={isEditing}>
              <DashboardSectionRenderer
                sectionId={sectionId}
                overview={overview}
                onNavigate={onNavigate}
              />
            </DashboardSortableSection>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
