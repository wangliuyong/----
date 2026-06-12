#!/usr/bin/env bash
# 微信小程序生产部署：构建 + 可选 CI 上传
#
# 环境变量（可写在 .env.local）：
#   VITE_MP_WEIXIN_APPID      小程序 AppID（必填，上传时）
#   MP_WEIXIN_PRIVATE_KEY     上传密钥文件路径（微信公众平台 → 开发 → 开发管理 → 小程序代码上传）
#   MP_WEIXIN_VERSION         版本号，默认读取 package.json version
#   MP_WEIXIN_DESC            上传描述，默认「便民小程序部署」
#
# 用法：
#   pnpm run deploy:mp-weixin              # 仅构建
#   MP_WEIXIN_PRIVATE_KEY=./private.key pnpm run deploy:mp-weixin   # 构建并上传

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

MP_BUILD_DIR="dist/build/mp-weixin"
MP_VERSION="${MP_WEIXIN_VERSION:-$(node -p "require('./package.json').version")}"
MP_DESC="${MP_WEIXIN_DESC:-便民小程序部署 $(date '+%Y-%m-%d %H:%M')}"

# 合并 .env.local / .env.production 中的 Vite 变量（不覆盖已 export 的值）
load_env_file() {
  local file="$1"
  [[ -f "$file" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^[[:space:]]*$ ]] && continue
    if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
      local key="${BASH_REMATCH[1]}"
      local val="${BASH_REMATCH[2]}"
      val="${val%\"}"; val="${val#\"}"
      val="${val%\'}"; val="${val#\'}"
      if [[ -z "${!key:-}" ]]; then
        export "$key=$val"
      fi
    fi
  done < "$file"
}

load_env_file ".env.production"
load_env_file ".env.local"

echo "==> [1/2] 构建微信小程序（production）..."
echo "    API: ${VITE_API_BASE_URL:-/api}"
echo "    AppID: ${VITE_MP_WEIXIN_APPID:-(未配置，仅本地预览)}"
NODE_ENV=production pnpm run build:mp-weixin

if [[ ! -d "$MP_BUILD_DIR" ]]; then
  echo "错误: 构建产物不存在 $MP_BUILD_DIR"
  exit 1
fi

echo ""
echo "==> 构建完成: $PROJECT_ROOT/$MP_BUILD_DIR"
echo "    可用微信开发者工具导入该目录进行预览/提审"

if [[ -z "${MP_WEIXIN_PRIVATE_KEY:-}" ]]; then
  echo ""
  echo "提示: 设置 MP_WEIXIN_PRIVATE_KEY 后可自动上传到微信后台"
  exit 0
fi

if [[ -z "${VITE_MP_WEIXIN_APPID:-}" ]]; then
  echo "错误: 上传需配置 VITE_MP_WEIXIN_APPID（写入 .env.local）"
  exit 1
fi

if [[ ! -f "$MP_WEIXIN_PRIVATE_KEY" ]]; then
  echo "错误: 上传密钥文件不存在: $MP_WEIXIN_PRIVATE_KEY"
  exit 1
fi

echo ""
echo "==> [2/2] 上传到微信小程序后台..."
pnpm exec miniprogram-ci upload \
  --pp "$PROJECT_ROOT" \
  --appid "$VITE_MP_WEIXIN_APPID" \
  --project-path "$MP_BUILD_DIR" \
  --private-key-path "$MP_WEIXIN_PRIVATE_KEY" \
  --version "$MP_VERSION" \
  --desc "$MP_DESC"

echo ""
echo "=========================================="
echo "  微信小程序上传成功"
echo "  AppID:   $VITE_MP_WEIXIN_APPID"
echo "  版本:    $MP_VERSION"
echo "  请登录微信公众平台 → 版本管理 → 提交审核"
echo "=========================================="
