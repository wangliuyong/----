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

echo "==> 打包项目文件..."
TAR_FILE="/tmp/personal-site-deploy.tar.gz"
ENV_FILE="/tmp/personal-site.env"
cd "$PROJECT_ROOT"
tar czf "$TAR_FILE" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='dist' \
  --exclude='*.db' \
  --exclude='*.db-journal' \
  --exclude='.git' \
  --exclude='.env.local' \
  .
printf 'PUBLIC_ORIGIN=http://%s\nHTTP_PORT=80\n' "$SERVER_IP" > "$ENV_FILE"

echo "==> 上传到服务器..."
ssh_cmd 60 mkdir -p "${REMOTE_DIR}"
scp_cmd "$TAR_FILE" "${REMOTE_DIR}/deploy.tar.gz"
scp_cmd "$ENV_FILE" "${REMOTE_DIR}/.env"
ssh_cmd 120 tar -xzf "${REMOTE_DIR}/deploy.tar.gz" -C "${REMOTE_DIR}"
ssh_cmd 30 rm -f "${REMOTE_DIR}/deploy.tar.gz"
ssh_cmd 30 chmod +x "${REMOTE_DIR}/docker/remote-deploy.sh"

echo "==> 远程构建并启动 Docker（首次约 15–30 分钟，请耐心等待）..."
ssh_cmd 3600 "${REMOTE_DIR}/docker/remote-deploy.sh"

rm -f "$TAR_FILE" "$ENV_FILE"

echo ""
echo "=========================================="
echo "  部署完成！"
echo "  访问地址: http://${SERVER_IP}"
echo "=========================================="
