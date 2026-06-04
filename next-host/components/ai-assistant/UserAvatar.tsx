'use client';

type UserAvatarSize = 'sm' | 'md';

interface UserAvatarProps {
  /** sm：消息气泡 · md：预留较大尺寸 */
  size?: UserAvatarSize;
  className?: string;
}

/**
 * 聊天气泡内用户头像
 * 线稿人物图标，与 Site Pup 头像框尺寸对齐
 */
export function UserAvatar({ size = 'sm', className = '' }: UserAvatarProps) {
  return (
    <span
      className={`user-avatar user-avatar--${size}${className ? ` ${className}` : ''}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8.5" r="3.25" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5.5 19.5c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};
