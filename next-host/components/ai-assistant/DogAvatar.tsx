'use client';

interface DogAvatarProps {
  /** 悬停时狗狗向左「走出来」 */
  walkedOut?: boolean;
}

/**
 * 趴在屏幕右缘的萌狗 SVG
 * 默认仅露出双爪与脑袋；walkedOut 时整只狗探出
 */
export function DogAvatar({ walkedOut = false }: DogAvatarProps) {
  return (
    <div
      className={`dog-avatar ${walkedOut ? 'dog-avatar--walked-out' : ''}`}
      aria-hidden
    >
      <svg
        className="dog-avatar__svg"
        viewBox="0 0 140 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 右缘「墙沿」示意线 */}
        <line
          className="dog-avatar__ledge"
          x1="132"
          y1="8"
          x2="132"
          y2="88"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.15"
        />

        {/* 后半截身体（在墙后） */}
        <ellipse cx="118" cy="58" rx="26" ry="20" fill="#F5D0A9" />
        <g className="dog-avatar__tail">
          <path
            d="M128 48c6 2 10 8 8 16-2 6-8 10-14 8"
            stroke="#E8A87C"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 左耳 */}
        <g className="dog-avatar__ear dog-avatar__ear--left">
          <ellipse cx="52" cy="28" rx="11" ry="16" fill="#E8A87C" transform="rotate(-22 52 28)" />
          <ellipse cx="54" cy="30" rx="6" ry="10" fill="#FFB4A2" transform="rotate(-22 54 30)" />
        </g>

        {/* 右耳 */}
        <g className="dog-avatar__ear dog-avatar__ear--right">
          <ellipse cx="78" cy="24" rx="10" ry="15" fill="#E8A87C" transform="rotate(14 78 24)" />
          <ellipse cx="76" cy="26" rx="5.5" ry="9" fill="#FFB4A2" transform="rotate(14 76 26)" />
        </g>

        {/* 头部（探出墙沿） */}
        <ellipse cx="66" cy="42" rx="28" ry="24" fill="#F5D0A9" />
        <ellipse cx="66" cy="48" rx="17" ry="12" fill="#FFF8F0" opacity="0.65" />

        {/* 眼睛 */}
        <g className="dog-avatar__eyes">
          <ellipse cx="56" cy="40" rx="4.5" ry="5.5" fill="#2D1810" />
          <ellipse cx="76" cy="40" rx="4.5" ry="5.5" fill="#2D1810" />
          <circle cx="57.5" cy="38.5" r="1.5" fill="#fff" />
          <circle cx="77.5" cy="38.5" r="1.5" fill="#fff" />
        </g>

        {/* 鼻子 */}
        <ellipse cx="66" cy="50" rx="5" ry="4.5" fill="#3D2314" />
        <ellipse cx="64.5" cy="49" rx="1.2" ry="0.8" fill="#fff" opacity="0.35" />

        {/* 嘴巴 + 舌头 */}
        <path
          d="M66 54c-3.5 3.5-9 3.5-12.5 0"
          stroke="#3D2314"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="dog-avatar__tongue"
          d="M66 55c0 3.5 2.5 6 5 5.5 2.5-0.5 3.5-3 3.5-5.5"
          fill="#FF8FAB"
        />

        {/* 腮红 */}
        <circle cx="48" cy="48" r="4.5" fill="#FFB4A2" opacity="0.35" />
        <circle cx="84" cy="48" r="4.5" fill="#FFB4A2" opacity="0.35" />

        {/* 双爪趴在右缘 */}
        <g className="dog-avatar__paws">
          <ellipse cx="124" cy="72" rx="10" ry="8" fill="#E8A87C" />
          <ellipse cx="124" cy="74" rx="6" ry="4" fill="#FFF5EB" opacity="0.5" />
          {/* 爪垫 */}
          <circle cx="121" cy="74" r="1.2" fill="#FFB4A2" />
          <circle cx="124" cy="75.5" r="1.2" fill="#FFB4A2" />
          <circle cx="127" cy="74" r="1.2" fill="#FFB4A2" />

          <ellipse cx="124" cy="86" rx="10" ry="8" fill="#E8A87C" />
          <ellipse cx="124" cy="88" rx="6" ry="4" fill="#FFF5EB" opacity="0.5" />
          <circle cx="121" cy="88" r="1.2" fill="#FFB4A2" />
          <circle cx="124" cy="89.5" r="1.2" fill="#FFB4A2" />
          <circle cx="127" cy="88" r="1.2" fill="#FFB4A2" />
        </g>

        {/* 前胸（搭在墙沿上） */}
        <ellipse cx="108" cy="62" rx="18" ry="14" fill="#F5D0A9" />
      </svg>
    </div>
  );
}
