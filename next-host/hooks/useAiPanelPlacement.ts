'use client';

import { useEffect, useState } from 'react';

/** 视口底边安全距 */
const BOTTOM_EDGE = 12;
/** 面板与顶栏/底边的间距 */
const PANEL_GAP = 8;
/** 面板可接受的最小高度 */
const MIN_PANEL = 320;

export interface AiPanelLayout {
  /** 面板竖直中心点（viewport px，用于 top + translateY(-50%)） */
  centerY: number;
  maxHeight: number;
}

/** 读取顶栏下缘，避免面板顶部被 sticky header 挡住 */
function getHeaderBottom(): number {
  if (typeof document === 'undefined') return 64;
  const el = document.querySelector('.site-header');
  return el ? el.getBoundingClientRect().bottom : 64;
}

/**
 * 在顶栏与底边之间的安全区内竖直居中，并限制 max-height 保证上下都不溢出
 */
export function resolvePanelLayout(): AiPanelLayout {
  const vh = window.innerHeight;
  const headerBottom = getHeaderBottom();
  const topSafe = headerBottom + PANEL_GAP;
  const bottomSafe = BOTTOM_EDGE + PANEL_GAP;
  const availableHeight = vh - topSafe - bottomSafe;
  /** 占满顶栏与底边之间的安全区，不再额外封顶 */
  const maxHeight = Math.max(MIN_PANEL, availableHeight);
  const centerY = topSafe + availableHeight / 2;

  return { centerY, maxHeight };
}

/**
 * 聊天面板布局：视口安全区竖直居中，resize / scroll 时重算
 */
export function useAiPanelPlacement(enabled: boolean) {
  const [layout, setLayout] = useState<AiPanelLayout>(() =>
    typeof window !== 'undefined' ? resolvePanelLayout() : { centerY: 400, maxHeight: 640 },
  );

  useEffect(() => {
    if (!enabled) return;

    const update = () => setLayout(resolvePanelLayout());

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [enabled]);

  return layout;
}
