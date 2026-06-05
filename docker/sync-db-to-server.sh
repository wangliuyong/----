#!/usr/bin/env bash
# 将本地开发库（SQLite + LanceDB 向量库）同步到生产服务器 Docker 卷
# 用法：./docker/sync-db-to-server.sh [服务器IP] [SSH密码]
#
# 本地数据源：
#   - nest-server/prisma/dev.db
#   - nest-server/data/lancedb（存在则一并同步）
#
# 生产目标（Docker 卷 docker_api-data）：
#   - /app/data/prod.db
#   - /app/data/lancedb

set -euo pipefail

SERVER_IP="${1:-47.116.30.137}"
SSH_PASS="${2:-}"
SSH_USER="${SSH_USER:-root}"
REMOTE_DIR="/opt/personal-site"
REMOTE_SYNC_DIR="/tmp/personal-site-db-sync"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

LOCAL_DB="${PROJECT_ROOT}/nest-server/prisma/dev.db"
LOCAL_LANCE="${PROJECT_ROOT}/nest-server/data/lancedb"

echo "==> 同步目标: ${SSH_USER}@${SERVER_IP}"
echo "==> 本地 SQLite: ${LOCAL_DB}"

if [ ! -f "$LOCAL_DB" ]; then
  echo "错误: 本地数据库不存在，请先在本机运行 API 并写入数据。" >&2
  exit 1
fi

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

echo "==> 上传本地数据库到服务器临时目录..."
ssh_cmd 60 "rm -rf ${REMOTE_SYNC_DIR} && mkdir -p ${REMOTE_SYNC_DIR}"
scp_cmd "${LOCAL_DB}" "${REMOTE_SYNC_DIR}/prod.db"

if [ -d "$LOCAL_LANCE" ]; then
  echo "==> 上传 LanceDB 向量库..."
  scp_cmd "${LOCAL_LANCE}" "${REMOTE_SYNC_DIR}/lancedb"
else
  echo "==> 跳过 LanceDB（本地目录不存在）"
fi

echo "==> 在服务器上替换生产数据（会先备份旧库）..."
scp_cmd "${SCRIPT_DIR}/remote-sync-db.sh" "${REMOTE_DIR}/docker/remote-sync-db.sh"
ssh_cmd 300 "chmod +x ${REMOTE_DIR}/docker/remote-sync-db.sh && ${REMOTE_DIR}/docker/remote-sync-db.sh ${REMOTE_SYNC_DIR}"

echo ""
echo "=========================================="
echo "  数据库同步完成！"
echo "  站点: http://${SERVER_IP}"
echo "=========================================="
