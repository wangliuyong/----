#!/usr/bin/env bash
# 一键部署到阿里云轻量服务器
# 用法：./docker/deploy.sh [服务器IP] [SSH密码]

set -euo pipefail

SERVER_IP="${1:-47.116.30.137}"
SSH_PASS="${2:-}"
SSH_USER="${SSH_USER:-root}"
REMOTE_DIR="/opt/personal-site"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> 部署目标: ${SSH_USER}@${SERVER_IP}:${REMOTE_DIR}"

ssh_cmd() {
  local timeout="${1:-300}"
  shift
  if [ -n "$SSH_PASS" ]; then
    expect <<EOF
set timeout ${timeout}
spawn ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} "$@"
expect {
  "password:" { send "${SSH_PASS}\r"; exp_continue }
  "Password:" { send "${SSH_PASS}\r"; exp_continue }
  eof
}
catch wait result
exit [lindex \$result 3]
EOF
  else
    ssh -o StrictHostKeyChecking=no "${SSH_USER}@${SERVER_IP}" "$@"
  fi
}

scp_cmd() {
  local src="$1"
  local dst="$2"
  if [ -n "$SSH_PASS" ]; then
    expect <<EOF
set timeout 600
spawn scp -o StrictHostKeyChecking=no -r ${src} ${SSH_USER}@${SERVER_IP}:${dst}
expect {
  "password:" { send "${SSH_PASS}\r"; exp_continue }
  "Password:" { send "${SSH_PASS}\r"; exp_continue }
  eof
}
catch wait result
exit [lindex \$result 3]
EOF
  else
    scp -o StrictHostKeyChecking=no -r "${src}" "${SSH_USER}@${SERVER_IP}:${dst}"
  fi
}

# 从本地 nest-server/.env 读取指定 key 的值（不含引号）
read_local_env() {
  local key="$1"
  local file="${PROJECT_ROOT}/nest-server/.env"
  [[ -f "$file" ]] || return 1
  local line
  line=$(grep -E "^${key}=" "$file" | tail -1 || true)
  [[ -n "$line" ]] || return 1
  local val="${line#*=}"
  val="${val%\"}"; val="${val#\"}"
  val="${val%\'}"; val="${val#\'}"
  [[ -n "$val" ]] || return 1
  printf '%s' "$val"
}

# 合并单个环境变量到服务器 ${REMOTE_DIR}/.env
merge_remote_env_key() {
  local key="$1"
  local val
  val="$(read_local_env "$key" || true)"
  [[ -n "$val" ]] || return 0
  echo "==> 同步 ${key} → 服务器 .env"
  ssh_cmd 30 "touch '${REMOTE_DIR}/.env' && (grep -v '^${key}=' '${REMOTE_DIR}/.env' 2>/dev/null || true) > '${REMOTE_DIR}/.env.tmp' && printf '%s=%s\n' '${key}' '${val}' >> '${REMOTE_DIR}/.env.tmp' && mv '${REMOTE_DIR}/.env.tmp' '${REMOTE_DIR}/.env'"
}

# 同步便民后端依赖的环境变量（高德逆地理等）
sync_convenience_env_to_server() {
  merge_remote_env_key "AMAP_WEB_SERVICE_KEY"
}

echo "==> 打包项目文件..."
TAR_FILE="/tmp/personal-site-deploy.tar.gz"
ENV_FILE="/tmp/personal-site.env"
cd "$PROJECT_ROOT"
# macOS 打包时跳过 xattr，避免 Linux 解压时出现大量 LIBARCHIVE 警告
COPYFILE_DISABLE=1 tar czf "$TAR_FILE" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='dist' \
  --exclude='*.db' \
  --exclude='*.db-journal' \
  --exclude='.git' \
  --exclude='.env.local' \
  --exclude='nest-server/.env' \
  .
printf 'PUBLIC_ORIGIN=http://%s\nHTTP_PORT=80\n' "$SERVER_IP" > "$ENV_FILE"

echo "==> 上传到服务器..."
ssh_cmd 60 mkdir -p "${REMOTE_DIR}"
scp_cmd "$TAR_FILE" "${REMOTE_DIR}/deploy.tar.gz"
# 仅首次部署写入 .env，避免覆盖服务器上已配置的密钥与密码
if ssh_cmd 30 "test -f '${REMOTE_DIR}/.env'"; then
  echo "==> 保留服务器已有 .env"
else
  scp_cmd "$ENV_FILE" "${REMOTE_DIR}/.env"
fi
ssh_cmd 120 tar -xzf "${REMOTE_DIR}/deploy.tar.gz" -C "${REMOTE_DIR}"
ssh_cmd 30 rm -f "${REMOTE_DIR}/deploy.tar.gz"
ssh_cmd 30 chmod +x "${REMOTE_DIR}/docker/remote-deploy.sh"

sync_convenience_env_to_server

echo "==> 远程构建并启动 Docker（首次约 15–30 分钟，请耐心等待）..."
ssh_cmd 3600 "${REMOTE_DIR}/docker/remote-deploy.sh"

rm -f "$TAR_FILE" "$ENV_FILE"

echo ""
echo "=========================================="
echo "  部署完成！"
echo "  个人站点:   http://${SERVER_IP}"
echo "  便民 C 端:  http://${SERVER_IP}/convenience/"
echo "  管理后台:   http://${SERVER_IP}/admin"
echo "  (便民管理:  登录后侧边栏「同城便民」)"
echo "=========================================="
