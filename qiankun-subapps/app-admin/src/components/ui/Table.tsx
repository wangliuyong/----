import { useMemo, useState, type ReactNode } from 'react';
import { UiButton } from './Button';
import './ui.scss';

export interface UiTableColumn<T> {
  title: ReactNode;
  dataIndex?: keyof T & string;
  key?: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  render?: (value: unknown, record: T, index: number) => ReactNode;
}

export interface UiTablePagination {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  showTotal?: (total: number) => ReactNode;
  pageSizeOptions?: string[];
  onChange?: (page: number, pageSize: number) => void;
}

export interface UiTableProps<T> {
  rowKey: keyof T | ((record: T) => string | number);
  columns: UiTableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  className?: string;
  scroll?: { x?: number | string };
  pagination?: UiTablePagination | false;
}

function resolveRowKey<T>(record: T, index: number, rowKey: UiTableProps<T>['rowKey']) {
  if (typeof rowKey === 'function') return String(rowKey(record));
  return String(record[rowKey] ?? index);
}

/** 数据表格：等宽字体表头 + 悬停高亮行 */
export function UiTable<T extends Record<string, unknown>>({
  rowKey,
  columns,
  dataSource,
  loading = false,
  className,
  scroll,
  pagination: paginationProp,
}: UiTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    paginationProp && paginationProp !== false ? paginationProp.pageSize ?? 10 : 10,
  );

  const pagination = paginationProp === false ? null : paginationProp ?? {};
  const total = pagination?.total ?? dataSource.length;
  const current = pagination?.current ?? page;
  const effectivePageSize = pagination?.pageSize ?? pageSize;

  const pageData = useMemo(() => {
    if (paginationProp === false) return dataSource;
    const start = (current - 1) * effectivePageSize;
    return dataSource.slice(start, start + effectivePageSize);
  }, [current, dataSource, effectivePageSize, paginationProp]);

  const totalPages = Math.max(1, Math.ceil(total / effectivePageSize));

  const handlePageChange = (next: number, nextSize?: number) => {
    setPage(next);
    if (nextSize) setPageSize(nextSize);
    pagination?.onChange?.(next, nextSize ?? effectivePageSize);
  };

  return (
    <div className={['ui-table-wrap', className].filter(Boolean).join(' ')}>
      <div className="ui-table-scroll" style={{ overflowX: scroll?.x ? 'auto' : undefined }}>
        <table className="ui-table" style={{ minWidth: scroll?.x ?? undefined }}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key ?? col.dataIndex ?? i}
                  style={{ width: col.width }}
                  className={col.fixed ? `ui-table__cell--fixed-${col.fixed}` : undefined}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="ui-table__loading">
                  <span className="ui-spin ui-spin--inline" />
                  加载中...
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="ui-table__empty">
                  暂无数据
                </td>
              </tr>
            ) : (
              pageData.map((record, rowIndex) => (
                <tr key={resolveRowKey(record, rowIndex, rowKey)}>
                  {columns.map((col, colIndex) => {
                    const value = col.dataIndex ? record[col.dataIndex] : undefined;
                    return (
                      <td
                        key={col.key ?? col.dataIndex ?? colIndex}
                        className={col.fixed ? `ui-table__cell--fixed-${col.fixed}` : undefined}
                      >
                        {col.render ? col.render(value, record, rowIndex) : (value as ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginationProp !== false && total > 0 ? (
        <div className="ui-table-pagination">
          {pagination?.showTotal ? (
            <span className="ui-table-pagination__total">{pagination.showTotal(total)}</span>
          ) : (
            <span className="ui-table-pagination__total">共 {total} 条</span>
          )}
          <div className="ui-table-pagination__controls">
            <UiButton
              size="sm"
              variant="default"
              disabled={current <= 1}
              onClick={() => handlePageChange(current - 1)}
            >
              上一页
            </UiButton>
            <span className="ui-table-pagination__page">
              {current} / {totalPages}
            </span>
            <UiButton
              size="sm"
              variant="default"
              disabled={current >= totalPages}
              onClick={() => handlePageChange(current + 1)}
            >
              下一页
            </UiButton>
            {pagination?.showSizeChanger ? (
              <select
                className="ui-table-pagination__size"
                value={effectivePageSize}
                onChange={(e) => handlePageChange(1, Number(e.target.value))}
              >
                {(pagination.pageSizeOptions ?? ['10', '20', '50', '100']).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} 条/页
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
