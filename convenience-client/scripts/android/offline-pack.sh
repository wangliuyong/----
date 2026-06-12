#!/usr/bin/env bash
# uni-app Android 离线打包（需 Android SDK + DCloud 离线 SDK）
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
APP_ID="__UNI__F1A1285"
SDK_DIR="${ANDROID_OFFLINE_SDK:-$ROOT_DIR/android/offline-sdk/HBuilder-Integrate-AS}"
OUTPUT_DIR="$ROOT_DIR/android/output"
WWW_SRC="$ROOT_DIR/dist/build/app"

echo "==> 1/5 编译 App 资源"
cd "$ROOT_DIR"
pnpm exec uni build -p app

echo "==> 2/5 检查签名证书"
bash "$ROOT_DIR/scripts/android/generate-keystore.sh"

echo "==> 3/5 检查离线 SDK"
if [[ ! -d "$SDK_DIR/simpleDemo" ]]; then
  cat <<'EOF'

未找到 Android 离线 SDK，请先手动下载（与编译器 4.84 / HBuilderX 5.07.2026041006 匹配）：

  百度云: https://pan.baidu.com/s/1AFjLggD7g6ue0iKgZ8yVyA?pwd=jrrb
  和彩云: https://yun.139.com/shareweb/#/w/i/2sUfBDp2GJAm2

解压后将 HBuilder-Integrate-AS 放到:
  convenience-client/android/offline-sdk/HBuilder-Integrate-AS

或设置环境变量 ANDROID_OFFLINE_SDK 指向该目录。

EOF
  exit 1
fi

echo "==> 4/5 同步 www 资源到原生工程"
ASSETS_DIR="$SDK_DIR/simpleDemo/src/main/assets/apps/$APP_ID/www"
rm -rf "$SDK_DIR/simpleDemo/src/main/assets/apps/$APP_ID"
mkdir -p "$ASSETS_DIR"
cp -R "$WWW_SRC/." "$ASSETS_DIR/"

# 同步 appid 到 dcloud_control.xml
CONTROL_XML="$SDK_DIR/simpleDemo/src/main/assets/data/dcloud_control.xml"
if [[ -f "$CONTROL_XML" ]]; then
  sed -i '' "s/appid=\"[^\"]*\"/appid=\"$APP_ID\"/g" "$CONTROL_XML" 2>/dev/null || \
    sed -i "s/appid=\"[^\"]*\"/appid=\"$APP_ID\"/g" "$CONTROL_XML"
fi

echo "==> 5/5 Gradle 构建 Release APK"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
if [[ ! -d "$ANDROID_HOME" ]]; then
  echo "未找到 Android SDK，请安装 Android Studio 或设置 ANDROID_HOME"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
cd "$SDK_DIR"
./gradlew :simpleDemo:assembleRelease

APK_PATH="$(find "$SDK_DIR/simpleDemo/build/outputs/apk" -name "*-release*.apk" | head -1)"
if [[ -n "$APK_PATH" ]]; then
  cp "$APK_PATH" "$OUTPUT_DIR/convenience-client-release.apk"
  echo ""
  echo "APK 已生成: $OUTPUT_DIR/convenience-client-release.apk"
else
  echo "Gradle 构建完成，但未找到 release APK，请检查 simpleDemo 模块签名配置"
  exit 1
fi
