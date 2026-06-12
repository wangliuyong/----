#!/usr/bin/env bash
# 生成 Android 签名证书（用于云打包 / 离线打包）
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
KEYSTORE_DIR="$ROOT_DIR/android/keystore"
KEYSTORE_FILE="$KEYSTORE_DIR/convenience-release.keystore"
ALIAS="convenience"
STORE_PASS="convenience123"
KEY_PASS="convenience123"

mkdir -p "$KEYSTORE_DIR"

if [[ -f "$KEYSTORE_FILE" ]]; then
  echo "证书已存在: $KEYSTORE_FILE"
  exit 0
fi

keytool -genkeypair \
  -alias "$ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 36500 \
  -keystore "$KEYSTORE_FILE" \
  -storepass "$STORE_PASS" \
  -keypass "$KEY_PASS" \
  -dname "CN=Convenience Client, OU=Mobile, O=Convenience, L=Beijing, ST=Beijing, C=CN"

echo ""
echo "Android 签名证书已生成:"
echo "  路径: $KEYSTORE_FILE"
echo "  别名: $ALIAS"
echo "  密码: $STORE_PASS"
echo ""
echo "请将 SHA1 填入 DCloud 开发者中心 → 应用管理 → Android 离线 AppKey："
keytool -list -v -keystore "$KEYSTORE_FILE" -storepass "$STORE_PASS" | grep -E "SHA1|SHA256"
