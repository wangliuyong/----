'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { AiAssistantWidget } from '@/components/ai-assistant/AiAssistantWidget';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      {/* 全局 AI 小助手：右侧吸附，悬停展开 */}
      <AiAssistantWidget />
    </ThemeProvider>
  );
}
