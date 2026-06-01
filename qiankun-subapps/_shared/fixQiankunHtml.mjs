/**
 * 修复 vite-plugin-qiankun 生产构建产物中的 index.html。
 *
 * 问题：插件会把 Vite 的 module script 转成内联 `import('...')`，
 *       而 qiankun 的 import-html-entry 通过 eval 执行脚本，
 *       导致 "Cannot enqueue a chunk into a readable stream" 错误。
 *
 * 解决：将内联 import() 改为动态创建 type="module" 的 script 标签加载。
 */
import fs from 'node:fs';
import path from 'node:path';

/** 匹配 vite-plugin-qiankun 注入的内联 import 脚本（兼容换行与空格） */
const IMPORT_SCRIPT_RE =
  /<script crossorigin="">import\('([^']+)'\)\.finally\(\(\)\s*=>\s*\{([\s\S]*?)\}\)<\/script>/;

/**
 * 修复单个 index.html 文件
 * @param {string} htmlPath - index.html 绝对/相对路径
 */
function fixQiankunHtml(htmlPath) {
  const abs = path.resolve(htmlPath);
  if (!fs.existsSync(abs)) {
    console.warn(`[fixQiankunHtml] 跳过，文件不存在: ${abs}`);
    return false;
  }

  const html = fs.readFileSync(abs, 'utf8');
  const match = html.match(IMPORT_SCRIPT_RE);
  if (!match) {
    console.warn(`[fixQiankunHtml] 未匹配到 import 脚本: ${abs}`);
    return false;
  }

  const [, src, finallyBody] = match;
  const replacement = `<script>(function(){
  var s=document.createElement('script');
  s.type='module';
  s.crossOrigin='';
  s.src='${src}';
  s.onload=function(){${finallyBody}};
  s.onerror=function(e){console.error('[qiankun] 子应用脚本加载失败:',e);};
  document.head.appendChild(s);
})();<\/script>`;

  fs.writeFileSync(abs, html.replace(IMPORT_SCRIPT_RE, replacement), 'utf8');
  console.log(`[fixQiankunHtml] 已修复: ${abs}`);
  return true;
}

// CLI：node fixQiankunHtml.mjs <dir1> [dir2] ...
const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error('用法: node fixQiankunHtml.mjs <dist目录> [...]');
  process.exit(1);
}

let fixed = 0;
for (const dir of dirs) {
  if (fixQiankunHtml(path.join(dir, 'index.html'))) fixed++;
}
console.log(`[fixQiankunHtml] 完成，共修复 ${fixed} 个文件`);
