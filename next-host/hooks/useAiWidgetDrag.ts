'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** 小助手垂直吸附档位 */
export type AiWidgetAnchor = 'top' | 'center' | 'bottom';

const STORAGE_KEY = 'ai-assistant-widget-anchor';
const EDGE = 20;
/** 萌犬按钮高度（与 CSS 一致，用于计算吸附点） */
const WIDGET_H = 96;
/** 移动超过此像素视为拖动，不触发点击 */
const DRAG_THRESHOLD = 8;

function readAnchor(): AiWidgetAnchor {
  if (typeof window === 'undefined') return 'bottom';
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'top' || v === 'center' || v === 'bottom') return v;
  return 'bottom';
}

/** SSR 与首屏渲染时避免直接访问 window */
function getViewportHeight(): number {
  if (typeof window === 'undefined') return 800;
  return window.innerHeight;
}

/** 根据档位计算 top（px） */
function anchorToTop(anchor: AiWidgetAnchor, vh = getViewportHeight()): number {
  const max = Math.max(EDGE, vh - WIDGET_H - EDGE);
  switch (anchor) {
    case 'top':
      return EDGE;
    case 'center':
      return Math.round((vh - WIDGET_H) / 2);
    case 'bottom':
      return max;
  }
}

/** 取最近的吸附档位 */
function nearestAnchor(top: number, vh = getViewportHeight()): AiWidgetAnchor {
  const candidates: AiWidgetAnchor[] = ['top', 'center', 'bottom'];
  let best: AiWidgetAnchor = 'bottom';
  let min = Infinity;
  for (const a of candidates) {
    const d = Math.abs(top - anchorToTop(a, vh));
    if (d < min) {
      min = d;
      best = a;
    }
  }
  return best;
}

function clampTop(top: number, vh = getViewportHeight()): number {
  return Math.min(Math.max(EDGE, top), Math.max(EDGE, vh - WIDGET_H - EDGE));
}

interface UseAiWidgetDragResult {
  top: number;
  anchor: AiWidgetAnchor;
  dragging: boolean;
  bindMascot: {
    onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLButtonElement>) => void;
    onPointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => void;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
}

/**
 * 小助手右侧垂直拖动 + 三档吸附（上 / 中 / 下）
 * 位置持久化到 localStorage
 */
export function useAiWidgetDrag(onOpen: () => void): UseAiWidgetDragResult {
  const [anchor, setAnchor] = useState<AiWidgetAnchor>('bottom');
  const [top, setTop] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);

  const topRef = useRef(0);
  const anchorRef = useRef<AiWidgetAnchor>('bottom');

  const dragRef = useRef({
    active: false,
    moved: false,
    startY: 0,
    startTop: 0,
  });

  topRef.current = top;
  anchorRef.current = anchor;

  /** 挂载时读取持久化档位 */
  useEffect(() => {
    const initial = readAnchor();
    setAnchor(initial);
    setTop(anchorToTop(initial));
    setReady(true);
  }, []);

  /** 窗口缩放时按当前档位重算 top */
  useEffect(() => {
    if (!ready) return;
    const onResize = () => setTop(anchorToTop(anchorRef.current));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [ready]);

  const persistAnchor = useCallback((a: AiWidgetAnchor) => {
    setAnchor(a);
    anchorRef.current = a;
    localStorage.setItem(STORAGE_KEY, a);
    setTop(anchorToTop(a));
  }, []);

  const finishDrag = useCallback(() => {
    if (!dragRef.current.moved) return;
    const next = nearestAnchor(topRef.current);
    persistAnchor(next);
  }, [persistAnchor]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current = {
      active: true,
      moved: false,
      startY: e.clientY,
      startTop: topRef.current,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.active) return;
    const dy = e.clientY - dragRef.current.startY;
    if (!dragRef.current.moved && Math.abs(dy) < DRAG_THRESHOLD) return;

    dragRef.current.moved = true;
    setDragging(true);
    setTop(clampTop(dragRef.current.startTop + dy));
  }, []);

  const releasePointer = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragRef.current.active) return;
      dragRef.current.active = false;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      finishDrag();
      setDragging(false);
    },
    [finishDrag],
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (dragRef.current.moved) {
        e.preventDefault();
        dragRef.current.moved = false;
        return;
      }
      onOpen();
    },
    [onOpen],
  );

  return {
    top: ready ? top : anchorToTop('bottom', getViewportHeight()),
    anchor,
    dragging,
    bindMascot: {
      onPointerDown,
      onPointerMove,
      onPointerUp: releasePointer,
      onPointerCancel: releasePointer,
      onClick,
    },
  };
}
