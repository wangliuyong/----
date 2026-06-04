import type { Article, Project } from '@shared/contentTypes';
import { getArticles, getProjects, getSiteConfig } from '@/lib/serverApi';

/** 首页 Hero 默认文案（站点配置未就绪时） */
export const FALLBACK_HERO = {
  name: '王刘永',
  title: '全栈开发工程师',
  intro:
    '六年一线经验，专注微前端架构、数据可视化与工程化。用克制的设计与可靠的代码，构建可长期维护的产品体验。',
};

export interface HomePageData {
  hero: typeof FALLBACK_HERO;
  articles: Article[];
  projects: Project[];
}

/** 服务端聚合首页数据：Hero + 近期文章/项目预览 */
export async function getHomePageData(): Promise<HomePageData> {
  const [cfg, articles, projects] = await Promise.all([
    getSiteConfig(),
    getArticles().catch(() => [] as Article[]),
    getProjects().catch(() => [] as Project[]),
  ]);

  const hero = cfg?.about
    ? {
        name: cfg.about.name || FALLBACK_HERO.name,
        title: cfg.about.title || FALLBACK_HERO.title,
        intro: cfg.about.intro || FALLBACK_HERO.intro,
      }
    : FALLBACK_HERO;

  return {
    hero,
    articles: articles.slice(0, 3),
    projects: projects.slice(0, 3),
  };
}
