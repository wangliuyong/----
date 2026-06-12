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

## Android APK 打包

uni-app CLI 只能编译 App 资源（`dist/build/app`），生成 APK 需 **云打包** 或 **离线打包**。

### 方式一：云打包（推荐）

已自动安装 HBuilderX 5.07，并生成签名证书。

```bash
# 1. 编译 App 资源 + 云打包（需 DCloud 账号）
pnpm run android:pack:cloud

# 首次请先登录 DCloud（在 https://dev.dcloud.net.cn 注册）
/Applications/HBuilderX.app/Contents/MacOS/cli user login --username 你的账号 --password 你的密码
```

打包成功后 CLI 会输出 APK 下载链接。也可在 HBuilderX：**发行 → 查看云打包状态**。

| 配置项 | 值 |
|--------|-----|
| 包名 | `com.convenience.client` |
| AppID | `__UNI__F1A1285` |
| 证书 | `android/keystore/convenience-release.keystore` |
| 证书别名/密码 | `convenience` / `convenience123` |

在 [DCloud 开发者中心](https://dev.dcloud.net.cn/) 创建应用后，将证书 SHA1 填入 Android 离线 AppKey：

```bash
pnpm run android:keystore   # 查看 SHA1
```

### 方式二：离线打包

1. 下载与 HBuilderX 5.07.2026041006 匹配的 [Android 离线 SDK](https://nativesupport.dcloud.net.cn/AppDocs/download/android.html)（百度云提取码: jrrb）
2. 解压到 `android/offline-sdk/HBuilder-Integrate-AS`
3. 安装 [Android Studio](https://developer.android.com/studio) 或配置 `ANDROID_HOME`
4. 执行：

```bash
pnpm run android:pack:offline
# 输出: android/output/convenience-client-release.apk
```

### 仅编译 App 资源

```bash
pnpm run build:app
# 产物: dist/build/app → 导入 HBuilderX 运行/打包
```

