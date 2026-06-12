/**
 * 将环境变量写入 src/manifest.json（高德地图 Key、H5 base 路径）
 * 用法：
 *   VITE_AMAP_KEY_WEB=xxx node scripts/apply-manifest-env.mjs
 *   VITE_H5_BASE=/convenience/ node scripts/apply-manifest-env.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(__dirname, '../src/manifest.json');

/** 高德 H5 JS API Key（Web端 JS API） */
const amapWebKey = process.env.VITE_AMAP_KEY_WEB || process.env.AMAP_KEY_WEB || '';
/** 高德 H5 安全密钥（JS API 2.0） */
const amapSecurityCode =
  process.env.VITE_AMAP_SECURITY_CODE || process.env.AMAP_SECURITY_CODE || '';
/** 高德 App Key */
const amapAndroid =
  process.env.VITE_AMAP_KEY_ANDROID || process.env.AMAP_KEY_ANDROID || '';
const amapIos = process.env.VITE_AMAP_KEY_IOS || process.env.AMAP_KEY_IOS || '';
/** 微信小程序 AppID（构建时写入 manifest.json → mp-weixin.appid） */
const mpWeixinAppid =
  process.env.VITE_MP_WEIXIN_APPID || process.env.MP_WEIXIN_APPID || '';
/** H5 路由 base，生产部署为 /convenience/ */
const h5Base = process.env.VITE_H5_BASE || process.env.H5_BASE || '';

let text = fs.readFileSync(manifestPath, 'utf8');

/** H5 amap：匹配 "key": "" 在 amap 块内（h5.sdkConfigs.maps.amap） */
text = text.replace(
  /("amap"\s*:\s*\{[^}]*"key"\s*:\s*")[^"]*(")/,
  `$1${amapWebKey}$2`,
);
text = text.replace(
  /("securityJsCode"\s*:\s*")[^"]*(")/,
  `$1${amapSecurityCode}$2`,
);
text = text.replace(
  /("appkey_android"\s*:\s*")[^"]*(")/,
  `$1${amapAndroid}$2`,
);
text = text.replace(
  /("appkey_ios"\s*:\s*")[^"]*(")/,
  `$1${amapIos}$2`,
);

if (mpWeixinAppid) {
  text = text.replace(
    /("mp-weixin"\s*:\s*\{\s*"appid"\s*:\s*")[^"]*(")/,
    `$1${mpWeixinAppid}$2`,
  );
}

if (h5Base) {
  text = text.replace(/("base"\s*:\s*")[^"]*(")/, `$1${h5Base}$2`);
}

fs.writeFileSync(manifestPath, text);

console.log(
  `[apply-manifest-env] amap.web=${amapWebKey ? `${amapWebKey.slice(0, 6)}***` : '(empty)'}` +
    `, amap.security=${amapSecurityCode ? 'set' : '(empty)'}` +
    `, amap.android=${amapAndroid ? `${amapAndroid.slice(0, 6)}***` : '(empty)'}` +
    `, amap.ios=${amapIos ? `${amapIos.slice(0, 6)}***` : '(empty)'}` +
    `, mp.appid=${mpWeixinAppid ? `${mpWeixinAppid.slice(0, 6)}***` : '(empty)'}` +
    (h5Base ? `, h5.base=${h5Base}` : ''),
);
