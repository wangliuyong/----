'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

/** 仅客户端挂载：避免预渲染阶段访问 window / localStorage */
const AiAssistantWidget = dynamic(
  () =>
    import('@/components/ai-assistant/AiAssistantWidget').then((mod) => ({
      default: mod.AiAssistantWidget,
    })),
  { ssr: false },
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      {/* 全局 AI 小助手：右侧吸附，悬停展开 */}
      <AiAssistantWidget />
    </ThemeProvider>
  );
}
