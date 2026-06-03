'use client';

/** 聊天小助手线稿头像（用户提供的萌犬图） */
export const ASSISTANT_AVATAR_SRC = '/images/ai-assistant/site-pup-avatar.png';

type AssistantAvatarSize = 'sm' | 'md' | 'lg';

interface AssistantAvatarProps {
  /** sm：消息气泡 · md：面板头部 · lg：欢迎区 */
  size?: AssistantAvatarSize;
  className?: string;
}

/**
 * 聊天框内 Site Pup 头像
 * 直接使用线稿 PNG，与右侧挂件 SVG 解耦
 */
export function AssistantAvatar({ size = 'sm', className = '' }: AssistantAvatarProps) {
  return (
    <img
      src={ASSISTANT_AVATAR_SRC}
      alt=""
      aria-hidden
      draggable={false}
      className={`assistant-avatar assistant-avatar--${size}${className ? ` ${className}` : ''}`}
    />
  );
}
