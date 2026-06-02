import { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../../_shared/api';
import {
  HomeHero,
  HomePostList,
  HomeProjectList,
  HomeSection,
  HomeShell,
  AppSkeleton,
  AppError,
} from '../../../_shared/components';
import { fetchSiteConfig } from '../../../_shared/siteConfig';

interface Article {
  id: number;
  title: string;
  summary?: string;
  publishedAt?: string;
}

interface Project {
  id: number;
  name: string;
  desc: string;
  techStack?: string;
}

/** 默认展示信息（API 未就绪时） */
const FALLBACK = {
  name: '王刘永',
  title: '前端开发工程师',
  intro:
    '六年一线经验，专注微前端架构、数据可视化与工程化。用克制的设计与可靠的代码，构建可长期维护的产品体验。',
};

/** 首页 — 刊物式个人入口（原 app-home） */
export default function HomePage({ apiBase }: { apiBase: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hero, setHero] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [cfg, arts, pros] = await Promise.all([
          fetchSiteConfig(apiBase).catch(() => null),
          fetchJson<Article[]>(apiUrl(apiBase, '/article/list')),
          fetchJson<Project[]>(apiUrl(apiBase, '/project/list')),
        ]);

        if (cancelled) return;

        if (cfg?.about) {
          setHero({
            name: cfg.about.name || FALLBACK.name,
            title: cfg.about.title || FALLBACK.title,
            intro: cfg.about.intro || FALLBACK.intro,
          });
        }

        setArticles(arts.slice(0, 3));
        setProjects(pros.slice(0, 3));
      } catch {
        if (!cancelled) {
          setError('内容加载失败，请确认后端已启动（端口 3001）');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  if (loading) {
    return (
      <HomeShell busy>
        <AppSkeleton lines={4} />
        <AppSkeleton lines={3} />
      </HomeShell>
    );
  }

  if (error) {
    return (
      <HomeShell>
        <AppError message={error} />
      </HomeShell>
    );
  }

  return (
    <HomeShell>
      <HomeHero name={hero.name} title={hero.title} intro={hero.intro} />
      <HomeSection
        index="01"
        title="近期写作"
        titleId="home-writings"
        moreHref="/blog"
        moreLabel="全部文章"
      >
        <HomePostList items={articles} />
      </HomeSection>
      <HomeSection
        index="02"
        title="精选项目"
        titleId="home-work"
        moreHref="/projects"
        moreLabel="全部项目"
      >
        <HomeProjectList items={projects} />
      </HomeSection>
    </HomeShell>
  );
}
