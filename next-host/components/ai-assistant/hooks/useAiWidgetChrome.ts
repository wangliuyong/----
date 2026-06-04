'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * AI 挂件 UI 状态：悬停、聊天开关、全屏与 Esc 退出。
 */
export function useAiWidgetChrome() {
  const [hovered, setHovered] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [panelFullscreen, setPanelFullscreen] = useState(false);

  const handleOpen = useCallback(() => {
    setChatOpen(true);
    setHovered(false);
  }, []);

  const handleClose = useCallback(() => {
    setChatOpen(false);
    setPanelFullscreen(false);
    setHovered(false);
  }, []);

  const togglePanelFullscreen = useCallback(() => {
    setPanelFullscreen((v) => !v);
  }, []);

  useEffect(() => {
    if (!chatOpen || !panelFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelFullscreen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [chatOpen, panelFullscreen]);

  const folded = !chatOpen && !hovered;
  const showShout = !chatOpen;

  return {
    hovered,
    setHovered,
    chatOpen,
    panelFullscreen,
    handleOpen,
    handleClose,
    togglePanelFullscreen,
    folded,
    showShout,
  };
}
