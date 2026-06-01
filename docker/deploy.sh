#!/usr/bin/env bash
# 一键部署到阿里云轻量服务器
# 用法：./docker/deploy.sh [服务器IP] [SSH密码]
# 示例：./docker/deploy.sh 47.116.30.137 'your-password'

set -euo pipefail

SERVER_IP="${1:-47.116.30.137}"
SSH_PASS="${2:-}"
SSH_USER="${SSH_USER:-root}"
REMOTE_DIR="/opt/personal-site"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "==> 部署目标: ${SSH_USER}@${SERVER_IP}:${REMOTE_DIR}"

# ---------- 使用 expect 进行密码登录 SSH/SCP ----------
ssh_cmd() {
  if [ -n "$SSH_PASS" ]; then
    expect <<EOF
set timeout 300
spawn ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} "$1"
expect {
  "password:" { send "${SSH_PASS}\r"; exp_continue }
  "Password:" { send "${SSH_PASS}\r"; exp_continue }
  eof
}
EOF
  else
    ssh -o StrictHostKeyChecking=no "${SSH_USER}@${SERVER_IP}" "$1"
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
EOF
  else
    scp -o StrictHostKeyChecking=no -r "${src}" "${SSH_USER}@${SERVER_IP}:${dst}"
  fi
}

# ---------- 1. 打包项目（排除 node_modules 等大目录） ----------
echo "==> 打包项目文件..."
TAR_FILE="/tmp/personal-site-deploy.tar.gz"
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

# ---------- 2. 上传并解压 ----------
echo "==> 上传到服务器..."
ssh_cmd "mkdir -p ${REMOTE_DIR}"
scp_cmd "$TAR_FILE" "${REMOTE_DIR}/deploy.tar.gz"
ssh_cmd "cd ${REMOTE_DIR} && tar xzf deploy.tar.gz && rm deploy.tar.gz"

# ---------- 3. 写入生产环境变量 ----------
echo "==> 配置环境变量..."
ssh_cmd "cat > ${REMOTE_DIR}/.env << 'ENVEOF'
PUBLIC_ORIGIN=http://${SERVER_IP}
HTTP_PORT=80
ENVEOF"

# ---------- 4. 检查 Docker 并启动服务 ----------
echo "==> 构建并启动 Docker 容器（首次可能需要 5-10 分钟）..."
ssh_cmd "cd ${REMOTE_DIR} && docker compose -f docker/docker-compose.yml --env-file .env down 2>/dev/null || true"
ssh_cmd "cd ${REMOTE_DIR} && docker compose -f docker/docker-compose.yml --env-file .env up -d --build"

# ---------- 5. 初始化数据库种子（仅首次） ----------
echo "==> 初始化数据库种子数据..."
ssh_cmd "cd ${REMOTE_DIR} && docker compose -f docker/docker-compose.yml exec -T api node dist/prisma/seed.js 2>/dev/null || echo '种子数据已存在或跳过'"

# ---------- 6. 检查服务状态 ----------
echo "==> 检查容器状态..."
ssh_cmd "cd ${REMOTE_DIR} && docker compose -f docker/docker-compose.yml ps"

rm -f "$TAR_FILE"

echo ""
echo "=========================================="
echo "  部署完成！"
echo "  访问地址: http://${SERVER_IP}"
echo "=========================================="
echo ""
echo "常用命令（在服务器上执行）："
echo "  查看日志: docker compose -f ${REMOTE_DIR}/docker/docker-compose.yml logs -f"
echo "  重启服务: docker compose -f ${REMOTE_DIR}/docker/docker-compose.yml restart"
echo "  停止服务: docker compose -f ${REMOTE_DIR}/docker/docker-compose.yml down"
