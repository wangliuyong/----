import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.article.deleteMany();
  await prisma.project.deleteMany();
  await prisma.link.deleteMany();

  await prisma.article.createMany({
    data: [
      {
        title: 'Next.js 与 Web Components 微前端实践',
        summary: '用 Lit 封装业务模块，Next 作主基座的轻量架构。',
        content:
          '# Next.js 与 Web Components\n\n本文介绍个人站点的微前端拆分方式。\n\n```ts\nconsole.log("hello wc");\n```',
        category: '前端',
        tags: 'Next.js,Web Components',
        slug: 'next-wc-microfrontend',
        publishedAt: new Date('2026-05-01'),
      },
      {
        title: 'NestJS + Prisma 快速搭建博客 API',
        summary: 'SQLite 本地开发，REST 接口供各子模块调用。',
        content: '# NestJS API\n\n使用 Prisma 管理文章、项目、留言与友链数据。',
        category: '后端',
        tags: 'NestJS,Prisma',
        slug: 'nestjs-prisma-api',
        publishedAt: new Date('2026-05-10'),
      },
      {
        title: '个人站点暗黑模式全链路',
        summary: 'next-themes 与 Shadow DOM 主题属性同步。',
        content: '# 暗黑模式\n\n主应用透传 `theme` 属性，子组件用 `:host([theme=dark])` 适配。',
        category: '前端',
        tags: 'CSS,主题',
        slug: 'dark-mode-sync',
        publishedAt: new Date('2026-05-20'),
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        name: '个人全能站点',
        desc: 'Next.js 主基座 + Lit Web Components + NestJS 后端。',
        techStack: 'Next.js, Lit, NestJS, Prisma',
        githubUrl: 'https://github.com',
        previewUrl: 'http://localhost:3000',
      },
      {
        name: '组件库 Playground',
        desc: '独立 Vite 打包的 Web Components 演示集合。',
        techStack: 'Vite, Lit, TypeScript',
        githubUrl: 'https://github.com',
      },
      {
        name: '博客 Markdown 渲染器',
        desc: 'marked + prismjs 在 Shadow DOM 内安全渲染。',
        techStack: 'marked, prismjs',
        previewUrl: 'http://localhost:3000/blog',
      },
    ],
  });

  await prisma.link.createMany({
    data: [
      {
        name: 'Next.js 文档',
        url: 'https://nextjs.org',
        description: 'React 全栈框架官方文档',
        sort: 1,
      },
      {
        name: 'Lit 官网',
        url: 'https://lit.dev',
        description: 'Web Components 开发框架',
        sort: 2,
      },
      {
        name: 'NestJS 文档',
        url: 'https://docs.nestjs.com',
        description: 'Node.js 服务端框架',
        sort: 3,
      },
    ],
  });

  console.log('Seed completed.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
