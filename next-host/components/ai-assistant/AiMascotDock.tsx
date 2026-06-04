'use client';

import type { MouseEventHandler, PointerEventHandler } from 'react';
import { MascotAvatar } from './MascotAvatar';

export interface AiMascotDockProps {
  chatOpen: boolean;
  hovered: boolean;
  dragging: boolean;
  showShout: boolean;
  bindMascot: {
    onPointerDown: PointerEventHandler<HTMLButtonElement>;
    onPointerMove: PointerEventHandler<HTMLButtonElement>;
    onPointerUp: PointerEventHandler<HTMLButtonElement>;
    onPointerCancel: PointerEventHandler<HTMLButtonElement>;
    onClick: MouseEventHandler<HTMLButtonElement>;
  };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/** 右侧萌犬吸附区：喊话气泡 + 可拖动 mascot 按钮 */
export function AiMascotDock({
  chatOpen,
  hovered,
  dragging,
  showShout,
  bindMascot,
  onMouseEnter,
  onMouseLeave,
}: AiMascotDockProps) {
  return (
    <>
      <div className="ai-widget__shout" aria-hidden={!showShout}>
        <svg
          className="ai-widget__shout-waves"
          viewBox="0 0 24 20"
          width="24"
          height="20"
          aria-hidden="true"
        >
          <path
            className="ai-widget__shout-wave ai-widget__shout-wave--1"
            d="M20 10 C16 10 14 6 10 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="ai-widget__shout-wave ai-widget__shout-wave--2"
            d="M20 10 C15 10 12 3 6 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            className="ai-widget__shout-wave ai-widget__shout-wave--3"
            d="M20 10 C14 10 10 1 2 1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="ai-widget__shout-bubble">
          <span className="ai-widget__shout-text ai-widget__shout-text--idle">
            主人<span className="ai-widget__shout-em">快点我</span>！
          </span>
          <span className="ai-widget__shout-text ai-widget__shout-text--hover">
            汪<span className="ai-widget__shout-em">汪汪</span>！
          </span>
        </div>
      </div>

      <button
        type="button"
        className="ai-widget__mascot"
        aria-label="拖动调整位置，点击打开站点智询"
        aria-expanded={chatOpen}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onPointerDown={bindMascot.onPointerDown}
        onPointerMove={bindMascot.onPointerMove}
        onPointerUp={bindMascot.onPointerUp}
        onPointerCancel={bindMascot.onPointerCancel}
        onClick={bindMascot.onClick}
      >
        <MascotAvatar peekedOut={hovered && !dragging} />
      </button>
    </>
  );
}
