'use client';

interface MascotAvatarProps {
  peekedOut?: boolean;
  mini?: boolean;
}

/** 线稿描边宽 */
const STROKE = 4.5;

/**
 * 极简线条萌犬 SVG — 参照线稿图
 *
 * 侧脸向左 · 立耳 · 四短腿 · 翘尾 · 闪电
 */
export function MascotAvatar({ peekedOut = false, mini = false }: MascotAvatarProps) {
  const shared = {
    stroke: 'currentColor',
    strokeWidth: STROKE,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (mini) {
    return (
      <svg className="mascot-avatar mascot-avatar--mini" viewBox="0 0 32 32" aria-hidden>
        <g className="mascot-avatar__ear mascot-avatar__ear--left">
          <path d="M5 7L7 2L11 6" fill="var(--ed-bg)" {...shared} />
        </g>
        <g className="mascot-avatar__ear mascot-avatar__ear--right">
          <path d="M18 6L21 1L25 7" fill="var(--ed-bg)" {...shared} />
        </g>
        <circle cx="13" cy="14" r="9" fill="var(--ed-bg)" {...shared} />
        <circle cx="10.5" cy="13" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="13" r="1.5" fill="currentColor" stroke="none" />
        <ellipse cx="13" cy="16.5" rx="1.8" ry="1.3" fill="currentColor" stroke="none" />
        <ellipse cx="22" cy="16" rx="5" ry="4" fill="var(--ed-bg)" {...shared} />
        <path d="M20 19v2M22 19v2M24 19v2" {...shared} fill="none" />
      </svg>
    );
  }

  return (
    <div className={`mascot-avatar ${peekedOut ? 'mascot-avatar--peeked-out' : ''}`} aria-hidden>
      <svg className="mascot-avatar__svg" viewBox="0 0 120 96" aria-hidden>
        {/* 闪电（尾后上方） */}
        <g className="mascot-avatar__spark">
          <path
            d="M88 14L80 28H86L78 42L94 24H87L88 14Z"
            fill="currentColor"
            stroke="none"
          />
        </g>

        {/* 身体 + 腿 + 尾（一体线稿） */}
        <g className="mascot-avatar__body">
          <path
            d="M58 42
               C72 38 96 40 102 52
               C106 62 104 72 94 76
               C84 80 68 78 58 70
               C54 66 54 48 58 42Z"
            fill="var(--ed-bg)"
            {...shared}
          />
          {/* 四条短腿 */}
          <path d="M64 74v10" {...shared} fill="none" />
          <path d="M74 74v10" {...shared} fill="none" />
          <path d="M84 74v10" {...shared} fill="none" />
          <path d="M94 74v10" {...shared} fill="none" />
          {/* 腿端圆角 */}
          <path d="M60 84h8M70 84h8M80 84h8M90 84h8" {...shared} fill="none" strokeWidth={STROKE + 0.5} />

          {/* 翘尾 */}
          <g className="mascot-avatar__tail">
            <path
              d="M100 48c6-8 10-14 8-20"
              {...shared}
              fill="none"
            />
            <path d="M106 30c0 4-2 8-6 10" {...shared} fill="none" />
          </g>
        </g>

        {/* 耳朵（头后层） */}
        <g className="mascot-avatar__ear mascot-avatar__ear--left">
          <path d="M11 28L17 4L29 22Z" fill="var(--ed-bg)" {...shared} />
        </g>
        <g className="mascot-avatar__ear mascot-avatar__ear--right">
          <path d="M37 24L45 2L55 20Z" fill="var(--ed-bg)" {...shared} />
        </g>

        {/* 头部（盖住耳根） */}
        <circle cx="38" cy="42" r="26" fill="var(--ed-bg)" {...shared} />

        {/* 五官：默认闭眼，探出时睁眼 */}
        <g className="mascot-avatar__head">
          <g className="mascot-avatar__eyes">
            <g className="mascot-avatar__eyes-closed">
              <path d="M24 40Q28 37 32 40" {...shared} fill="none" strokeWidth={3.2} />
              <path d="M42 40Q46 37 50 40" {...shared} fill="none" strokeWidth={3.2} />
            </g>
            <g className="mascot-avatar__eyes-open">
              <circle cx="28" cy="40" r="4" fill="currentColor" stroke="none" />
              <circle cx="46" cy="40" r="4" fill="currentColor" stroke="none" />
            </g>
          </g>
          <ellipse cx="37" cy="50" rx="5" ry="3.8" fill="currentColor" stroke="none" />
        </g>
      </svg>
    </div>
  );
}
