import { useEffect, useState } from 'react';
import type { Article, Project } from '../../../../_shared/contentTypes';
import { fetchSiteConfig } from '../../../../_shared/siteConfig';
import { useApiBase } from '../../context/ApiBaseContext';
import { webApi } from '../../utils/webApi';

/** 首页 Hero 默认文案（站点配置未就绪时） */
export const FALLBACK_HERO = {
  name: '王刘永',
  title: '前端开发工程师',
  intro:
    '六年一线经验，专注微前端架构、数据可视化与工程化。用克制的设计与可靠的代码，构建可长期维护的产品体验。',
};

/** 首页聚合数据：Hero + 近期文章/项目预览 */
export function useHome() {
  const apiBase = useApiBase();
  const [hero, setHero] = useState(FALLBACK_HERO);
  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
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
          webApi.listArticles(apiBase),
          webApi.listProjects(apiBase),
        ]);

        if (cancelled) return;

        if (cfg?.about) {
          setHero({
            name: cfg.about.name || FALLBACK_HERO.name,
            title: cfg.about.title || FALLBACK_HERO.title,
            intro: cfg.about.intro || FALLBACK_HERO.intro,
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

  return { hero, articles, projects, loading, error };
}
