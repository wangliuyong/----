/**
 * 校验 mock 主题配图是否齐全（本地 static/mock/topics）
 * 用法：node scripts/verify-mock-topics.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOPICS_DIR = path.resolve(__dirname, '../src/static/mock/topics');
const MIN_BYTES = 4096;

/** 与 mock-images.ts 中 MOCK_TOPIC_KEYS 保持一致 */
const TOPIC_KEYS = fs
  .readFileSync(path.resolve(__dirname, '../src/mock/mock-images.ts'), 'utf8')
  .match(/export const MOCK_TOPIC_KEYS = \[([\s\S]*?)\] as const/)?.[1]
  ?.match(/'([\w-]+)'/g)
  ?.map((s) => s.replace(/'/g, '')) || [];

let failed = false;

for (const topic of TOPIC_KEYS) {
  const file = path.join(TOPICS_DIR, `${topic}.jpg`);
  if (!fs.existsSync(file)) {
    console.error(`MISSING  ${topic}.jpg`);
    failed = true;
    continue;
  }
  const size = fs.statSync(file).size;
  if (size < MIN_BYTES) {
    console.error(`TOO_SMALL ${topic}.jpg (${size} bytes)`);
    failed = true;
    continue;
  }
  const head = fs.readFileSync(file).subarray(0, 3);
  if (head[0] !== 0xff || head[1] !== 0xd8) {
    console.error(`NOT_JPEG ${topic}.jpg`);
    failed = true;
  }
}

const extra = fs
  .readdirSync(TOPICS_DIR)
  .filter((f) => f.endsWith('.jpg'))
  .map((f) => f.replace('.jpg', ''))
  .filter((t) => !TOPIC_KEYS.includes(t));

console.log(`Topics expected: ${TOPIC_KEYS.length}`);
console.log(`Topics on disk: ${fs.readdirSync(TOPICS_DIR).filter((f) => f.endsWith('.jpg')).length}`);
if (extra.length) console.log(`Extra files (ok): ${extra.join(', ')}`);

if (failed) {
  console.error('\nVerify FAILED — run: node scripts/download-mock-topics.mjs');
  process.exit(1);
}
console.log('\nVerify OK — all topic images present and valid JPEG');
