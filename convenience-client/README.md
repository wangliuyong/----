# 同城便民 C 端（convenience-client）

uni-app + uview-plus 多端客户端，支持 **微信小程序 / H5 / APP**。

## 技术栈

- uni-app Vue3 + TypeScript + Vite
- uview-plus 3.x
- Pinia
- Mock 数据层（可切换真实 NestJS API）

## 快速开始

```bash
pnpm install
pnpm run dev:h5        # H5 → http://localhost:5175
pnpm run dev:mp-weixin  # 微信小程序
pnpm run dev:app       # APP
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_USE_MOCK` | `true` 使用 Mock，`false` 请求真实后端 |
| `VITE_API_BASE_URL` | API 基址，默认 `http://localhost:3002/api` |

## Mock 账号

- 手机号：`13800138000`
- 密码：`123456`

## 目录说明

```
src/
├── api/          # query* / post* 接口层
├── mock/         # Mock 数据
├── pages/        # 页面（TabBar + 子页）
├── components/   # 业务组件
├── stores/       # Pinia
├── types/        # TS 类型（对齐后端表结构）
└── utils/        # 工具函数
```

## 微信小程序

1. 在 `src/manifest.json` → `mp-weixin.appid` 填入真实 AppID
2. 在微信公众平台配置 request / upload 合法域名
3. 使用微信开发者工具导入 `dist/dev/mp-weixin` 目录
