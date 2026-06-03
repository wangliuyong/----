'use client';

import { memo } from 'react';

/**
 * Qiankun 子应用挂载点（React.memo 保证父组件 state 变更时不 re-render）
 *
 * 若挂载点随 loading / theme / 路由等 state 一起 re-render，React 18 会把
 * Qiankun 写入的子节点当作「多余 DOM」清掉，导致子应用被意外卸载。
 * 因此挂载点必须独立成 memo 组件，且 React 永不向其内部插入子元素。
 */

/** 前台内容区：app-web（管理后台复用同一 id，样式通过 className 覆盖） */
export const WebMicroContainer = memo(function WebMicroContainer({
  className = 'w-full min-h-[40vh]',
}: {
  className?: string;
}) {
  return (
    <div id="micro-container" className={className} suppressHydrationWarning />
  );
});
