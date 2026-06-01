# 个人全能站点

Next.js 主基座 + Qiankun 微前端子应用 + NestJS 后端。

## 目录结构

```
├── nest-server/         # NestJS + Prisma + SQLite API（端口 3001）
├── next-host/           # Next.js 14 主基座 + Qiankun（端口 3000）
├── qiankun-subapps/     # 6 个 Vite + React 子应用（端口 4001–4006）
│   ├── app-home/
│   ├── app-about/
│   ├── app-blog/
│   ├── app-projects/
│   ├── app-contact/
│   └── app-links/
└── doc/                 # PRD 与技术方案
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

### 3. 环境变量（可选）

复制 `next-host/.env.local.example` 为 `next-host/.env.local`。

### 4. 一键启动（推荐）

在项目根目录执行：

```bash
pnpm install
pnpm run dev:all
```

等价命令：`pnpm run dev`（别名）

会并行启动：后端 (3001)、主基座 (3000)、六个子应用 (4001–4006)。  
浏览器访问：**http://localhost:3000**  
按 `Ctrl+C` 可一次退出全部进程。

### 5. 分终端启动（可选）

若需单独调试某个服务，仍可使用：

```bash
pnpm run dev:api          # 后端
pnpm run dev:web          # 主基座
pnpm run dev:sub:home     # 子应用 4001 … 以此类推
```

## 生产构建

```bash
pnpm run build:subapps
pnpm run build:web
```

子应用静态资源部署后，在 `next-host/.env.local` 中配置 `NEXT_PUBLIC_MICRO_*` 为线上 entry 地址。

## 文档

- [doc/PRD.md](doc/PRD.md) — 产品需求
- [doc/技术方案.md](doc/技术方案.md) — 技术实现
