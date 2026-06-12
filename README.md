# 个人全能站点

Next.js 主基座 + Qiankun 微前端子应用 + NestJS 后端。

## 目录结构

```
├── nest-server/         # NestJS + Prisma + SQLite API（端口 3001）
├── next-host/           # Next.js 14 主基座 + Qiankun（端口 3000）
├── qiankun-subapps/     # Vite + React 子应用
│   ├── app-web/         # 前台统一子应用（首页 / 关于 / 博客 / 项目 / 联系 / 友链，端口 4001）
│   └── app-admin/       # 管理后台（端口 4007）
├── convenience-client/  # 同城便民 uni-app（微信小程序 / H5 / APP，端口 5175）
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

会并行启动：后端 (3001)、主基座 (3000)、前台子应用 app-web (4001)、管理后台 app-admin (4007)。  
浏览器访问：**http://localhost:3000**  
按 `Ctrl+C` 可一次退出全部进程。

### 5. 分终端启动（可选）

```bash
pnpm run dev:api          # 后端
pnpm run dev:web          # 主基座
pnpm run dev:sub:web      # 前台子应用 4001（供基座加载）
pnpm run dev:sub:admin    # 管理后台 4007（供基座加载）
pnpm run dev:web:standalone   # 仅 API + 前台子应用，浏览器访问 http://localhost:4001
pnpm run dev:admin:standalone # 仅 API + 管理后台，浏览器访问 http://localhost:4007
```

## 生产构建

```bash
pnpm run build:subapps
pnpm run build:web
```

子应用静态资源部署后，在 `next-host/.env.local` 中配置 `NEXT_PUBLIC_MICRO_WEB`、`NEXT_PUBLIC_MICRO_ADMIN` 为线上 entry 地址。

## 同城便民 uni-app（convenience-client）

C 端小程序 / H5 / APP，技术栈：**uni-app Vue3 + uview-plus + Pinia**，默认对接 **nest-server 真实 API**（`VITE_API_BASE_URL=http://localhost:3001/api`）。

### 一键启动（推荐）

在项目根目录：

```bash
pnpm run dev:convenience:all
```

并行启动：**后端 API (3001)** + **便民 H5 (5175)**。浏览器访问 **http://localhost:5175**。

含管理后台时（API + H5 + 后台 4007）：

```bash
pnpm run dev:convenience:full
```

- C 端 H5：http://localhost:5175  
- 管理后台：http://localhost:4007/login（账号 `admin` / `admin123`）

### 分端启动

```bash
# 安装依赖（或在根目录 pnpm run install:convenience）
cd convenience-client && pnpm install

# 仅 H5（需另开终端启动 pnpm run dev:api）
pnpm run dev:convenience:h5

# 微信小程序（需微信开发者工具导入 dist/dev/mp-weixin）
pnpm run dev:convenience

# APP
pnpm run dev:convenience:app
```

C 端测试账号：手机号 `13800138000`，密码 `123456`。

## 文档

- [doc/PRD.md](doc/PRD.md) — 产品需求
- [doc/技术方案.md](doc/技术方案.md) — 技术实现

## 一键部署

```bash
./docker/deploy.sh 47.116.30.137 '你的SSH密码'
```
