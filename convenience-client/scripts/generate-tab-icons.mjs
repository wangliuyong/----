/**
 * 生成 TabBar 图标（81x81 PNG）
 * 未选中：#94A3B8  选中：#0369A1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../src/static/tab');
const SIZE = 81;

/** 构建 SVG 字符串 */
function buildSvg(paths, color, fill = 'none') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 24 24" fill="none">
  <g transform="translate(0,0) scale(3.375)" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="${fill}">
    ${paths}
  </g>
</svg>`;
}

const ICONS = {
  home: {
    normal: buildSvg(
      '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z"/>',
      '#94A3B8',
    ),
    active: buildSvg(
      '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z"/>',
      '#0369A1',
      '#0369A1',
    ),
  },
  category: {
    normal: buildSvg(
      '<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>',
      '#94A3B8',
    ),
    active: buildSvg(
      '<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>',
      '#0369A1',
      '#0369A1',
    ),
  },
  publish: {
    normal: buildSvg(
      '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
      '#94A3B8',
    ),
    active: buildSvg(
      '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
      '#0369A1',
      '#0369A1',
    ),
  },
  ai: {
    normal: buildSvg(
      '<path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8l-4 3V6a1 1 0 0 1 1-1z"/><path d="M8 10h8M8 13h5"/>',
      '#94A3B8',
    ),
    active: buildSvg(
      '<path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8l-4 3V6a1 1 0 0 1 1-1z"/><path d="M8 10h8M8 13h5"/>',
      '#0369A1',
      '#0369A1',
    ),
  },
  mine: {
    normal: buildSvg(
      '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/>',
      '#94A3B8',
    ),
    active: buildSvg(
      '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/>',
      '#0369A1',
      '#0369A1',
    ),
  },
};

async function main() {
  const sharp = (await import('sharp')).default;
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const [name, svgPair] of Object.entries(ICONS)) {
    for (const [state, svg] of Object.entries(svgPair)) {
      const suffix = state === 'active' ? '-active' : '';
      const outPath = path.join(OUT_DIR, `${name}${suffix}.png`);
      await sharp(Buffer.from(svg)).png().resize(SIZE, SIZE).toFile(outPath);
      console.log('generated', outPath);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
