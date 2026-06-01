/** 导航项结构 */
export interface NavItemDto {
  href: string;
  label: string;
}

/** 关于页 Profile 结构（与 app-about 一致） */
export interface ProfileDto {
  name: string;
  title: string;
  location: string;
  email: string;
  github: string;
  intro: string;
  education: string;
  certifications: string[];
  strengths: string[];
  experiences: Array<{
    period: string;
    company: string;
    role: string;
    summary: string;
  }>;
  skillGroups: Array<{
    title: string;
    description: string;
    items: string[];
  }>;
}

/** 联系页扩展文案 */
export interface ContactConfigDto {
  intro?: string;
}

/** 默认导航 */
export const DEFAULT_NAV: NavItemDto[] = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我' },
  { href: '/blog', label: '博客' },
  { href: '/projects', label: '项目' },
  { href: '/contact', label: '联系我' },
  { href: '/links', label: '友链' },
];

/** 默认关于页内容 */
export const DEFAULT_ABOUT: ProfileDto = {
  name: '王刘永',
  title: '前端开发工程师（6 年经验）',
  location: '中国 · 杭州',
  email: 'hello@wly.dev',
  github: 'https://github.com/wly-dev',
  intro:
    '专注于中大型前端应用架构、可视化交互与跨端体验优化，擅长把复杂业务抽象为稳定可维护的前端工程系统。',
  education: '本科 · 计算机科学与技术',
  certifications: ['阿里云 ACA 前端专项', 'Vue.js 进阶认证'],
  strengths: [
    '复杂业务抽象与组件化架构',
    'Three.js 与 3D 数据可视化交互',
    '前端性能优化与工程化体系建设',
    '微前端（Qiankun）与全栈协作（NestJS）',
  ],
  experiences: [
    {
      period: '2023.04 — 至今',
      company: '某智能科技公司',
      role: '高级前端开发工程师',
      summary: '负责数据驾驶舱与管理后台重构，建立统一微前端规范。',
    },
  ],
  skillGroups: [
    {
      title: '框架与工程化',
      description: '构建稳定可扩展的大型前端工程体系。',
      items: ['Vue 3 / React', 'TypeScript', 'Next.js / NestJS', 'Qiankun'],
    },
  ],
};

/** 默认联系页文案 */
export const DEFAULT_CONTACT: ContactConfigDto = {
  intro: '欢迎通过以下方式与我联系，或在下方留言。',
};

/** 对外公开的站点配置结构 */
export interface PublicSiteConfig {
  siteName: string;
  githubUrl: string;
  email: string;
  nav: NavItemDto[];
  about: ProfileDto;
  contact: ContactConfigDto;
}
