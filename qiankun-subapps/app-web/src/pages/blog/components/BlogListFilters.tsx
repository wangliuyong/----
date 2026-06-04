import { AppButton, AppInput } from '../../../../../_shared/components';
import { cn } from '../../../../../_shared/utils/cn';

export interface BlogListFiltersProps {
  filterCategory: string;
  categories: string[];
  onCategoryChange: (value: string) => void;
  onTagBlur: (value: string) => void;
  onReload: () => void;
  className?: string;
}

/** 博客列表筛选栏 */
export default function BlogListFilters({
  filterCategory,
  categories,
  onCategoryChange,
  onTagBlur,
  onReload,
  className,
}: BlogListFiltersProps) {
  return (
    <div className={cn('flex flex-wrap gap-3 mb-6 app-toolbar', className)}>
      <select
        className="app-input w-auto min-w-[140px]"
        value={filterCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">全部分类</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <AppInput
        className="w-auto min-w-[140px]"
        placeholder="按标签筛选"
        onBlur={(e) => onTagBlur(e.target.value)}
      />
      <AppButton onClick={onReload}>筛选</AppButton>
    </div>
  );
}
