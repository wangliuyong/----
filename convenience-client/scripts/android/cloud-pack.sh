#!/usr/bin/env bash
# uni-app Android 云打包（需 HBuilderX + DCloud 账号登录）
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
CONFIG_FILE="$ROOT_DIR/scripts/android/pack-config.json"
HX_CLI="/Applications/HBuilderX.app/Contents/MacOS/cli"
HX_DMG_URL="https://download1.dcloud.net.cn/download/HBuilderX.5.07.2026041006.arm64.dmg"
HX_CACHE="$ROOT_DIR/android/.cache/HBuilderX.5.07.2026041006.arm64.dmg"

echo "==> 1/4 编译 App 资源 (uni build -p app)"
cd "$ROOT_DIR"
pnpm exec uni build -p app

echo "==> 2/4 检查 Android 签名证书"
bash "$ROOT_DIR/scripts/android/generate-keystore.sh"

echo "==> 3/5 检查 Node 版本（云打包编译需 Node 16+）"
NODE20="/Users/wly/.nvm/versions/node/v20.20.2/bin/node"
if [[ -x "$NODE20" ]]; then
  CURRENT_NODE="$(/usr/local/bin/node -v 2>/dev/null || echo 'none')"
  if [[ "$CURRENT_NODE" != v20.* && "$CURRENT_NODE" != v18.* && "$CURRENT_NODE" != v16.* ]]; then
    echo "将 /usr/local/bin/node 指向 Node 20（原版本已备份为 node-v14.bak）"
    [[ -f /usr/local/bin/node && ! -f /usr/local/bin/node-v14.bak ]] && mv /usr/local/bin/node /usr/local/bin/node-v14.bak
    ln -sf "$NODE20" /usr/local/bin/node
  fi
fi

echo "==> 4/5 检查 HBuilderX"
if [[ ! -x "$HX_CLI" ]]; then
  echo "未检测到 HBuilderX，正在下载 arm64 版..."
  mkdir -p "$(dirname "$HX_CACHE")"
  if [[ ! -f "$HX_CACHE" ]]; then
    curl -L "$HX_DMG_URL" -o "$HX_CACHE"
  fi
  MOUNT_POINT="$(hdiutil attach "$HX_CACHE" -nobrowse | awk '/\/Volumes\// {print $3; exit}')"
  cp -R "$MOUNT_POINT/HBuilderX.app" /Applications/
  hdiutil detach "$MOUNT_POINT" >/dev/null
  echo "HBuilderX 已安装到 /Applications/HBuilderX.app"
fi

echo "==> 5/6 导入项目并启动 HBuilderX"
"$HX_CLI" open || true
sleep 3
"$HX_CLI" project open --path "$ROOT_DIR" 2>/dev/null || true
sleep 2

echo "==> 6/6 发起 Android 云打包"
echo "提示：首次使用需登录 DCloud 账号："
echo "  $HX_CLI user login --username <账号> --password <密码>"
echo ""

"$HX_CLI" pack --config "$CONFIG_FILE"

echo ""
echo "打包完成后，CLI 会输出 APK 临时下载链接（可下载 5 次）。"
echo "也可在 HBuilderX 菜单：发行 → 查看云打包状态"
