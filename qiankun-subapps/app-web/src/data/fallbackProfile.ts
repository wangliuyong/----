import type { SiteProfile } from '../../../_shared/siteConfig';

/** 关于页静态资料（API 未就绪时兜底） */
export const fallbackProfile: SiteProfile = {
  name: '王刘永',
  title: '前端开发工程师（6 年经验）',
  location: '中国 · 杭州',
  email: 'hello@wly.dev',
  github: 'https://github.com/wly-dev',
  intro:
    '专注于中大型前端应用架构、可视化交互与跨端体验优化，擅长把复杂业务抽象为稳定可维护的前端工程系统。日常关注工程化、性能与可观测性，并持续输出技术博客与实践项目。',
  education: '本科 · 计算机科学与技术',
  certifications: ['阿里云 ACA 前端专项', 'Vue.js 进阶认证'],
  strengths: [
    '复杂业务抽象与组件化架构',
    'Three.js 与 3D 数据可视化交互',
    '前端性能优化与工程化体系建设',
    '跨端方案（H5 / 小程序 / App WebView）',
    '微前端（Qiankun）与全栈协作（NestJS）',
  ],
  experiences: [
    {
      period: '2023.04 — 至今',
      company: '某智能科技公司',
      role: '高级前端开发工程师',
      summary:
        '负责数据驾驶舱与管理后台重构，建立统一微前端规范，首屏加载耗时下降 42%，线上异常率下降 36%。',
    },
    {
      period: '2021.02 — 2023.03',
      company: '某互联网平台',
      role: '前端开发工程师',
      summary:
        '主导小程序与 App 内嵌 H5 项目开发，完成活动系统低代码化，研发效率提升 30%+。',
    },
    {
      period: '2019.07 — 2021.01',
      company: '某数字化服务公司',
      role: '前端开发工程师',
      summary:
        '负责 B 端中后台与 BI 可视化项目，搭建组件库与脚手架，保障多项目一致性与可维护性。',
    },
  ],
  skillGroups: [
    {
      title: '框架与工程化',
      description: '构建稳定可扩展的大型前端工程体系。',
      items: ['Vue 3 / React', 'TypeScript', 'Vite / Webpack', 'Next.js / NestJS', 'Pinia / Qiankun'],
    },
    {
      title: '可视化与交互',
      description: '高质感交互与数据可视化表达。',
      items: ['Three.js', 'ECharts / D3', 'GSAP 动效', 'Tailwind CSS'],
    },
    {
      title: '跨端与性能',
      description: '端到端体验与交付效率。',
      items: ['微信小程序', 'App WebView', '性能优化', 'CI/CD', 'Prisma / SQLite'],
    },
  ],
};
