# 个人全能站点

Next.js 主基座 + Lit Web Components 业务模块 + NestJS 后端。

## 目录结构

```
├── nest-server/       # NestJS + Prisma + SQLite API（端口 3001）
├── next-host/         # Next.js 14 主基座（端口 3000）
├── web-components/    # 6 个独立 Lit 组件，构建产物输出到 next-host/public/wc
└── doc/               # PRD 与技术方案
```

## 快速开始

### 1. 安装依赖

```bash
pnpm run install:all
```

### 2. 初始化数据库

```bash
cd nest-server
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init
pnpm exec ts-node prisma/seed.ts
cd ..
```

### 3. 构建 Web Components

```bash
pnpm run build:wc
```

### 4. 启动服务

终端 A — 后端：

```bash
pnpm run dev:api
```

终端 B — 前端：

```bash
pnpm run dev:web
```

访问 http://localhost:3000

## 环境变量

复制 `next-host/.env.local.example` 为 `next-host/.env.local`：

```
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
NEXT_PUBLIC_WC_BASE=/wc
```

## 相关文档

- [产品需求文档（PRD）](./doc/PRD.md)
- [技术方案](./doc/技术方案.md)
