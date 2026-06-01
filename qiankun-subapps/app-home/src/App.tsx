import { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../_shared/api';
import { fetchSiteConfig } from '../../_shared/siteConfig';
import type { HostProps } from '../../_shared/mountApp';

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

interface AppProps {
  apiBase: string;
  hostProps?: HostProps;
}

/** 默认展示信息（API 未就绪时） */
const FALLBACK = {
  name: '王刘永',
  title: '前端开发工程师',
  intro:
    '六年一线经验，专注微前端架构、数据可视化与工程化。用克制的设计与可靠的代码，构建可长期维护的产品体验。',
};

/**
 * 首页 — 刊物式个人入口
 * - 从站点配置拉取姓名/简介，动态展示
 * - 博客与项目采用列表式排版，替代通用 Card 网格
 */
export default function App({ apiBase }: AppProps) {
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

  /** 格式化为简短日期 */
  const formatDate = (value?: string) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
    });
  };

  /** 技术栈拆分为标签数组 */
  const splitStack = (stack?: string) =>
    stack
      ? stack
          .split(/[,，、|/]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  if (loading) {
    return (
      <div className="home" aria-busy="true">
        <div className="home-skeleton" style={{ padding: '24px 0 48px' }}>
          <div className="home-skeleton-line home-skeleton-line--sm" />
          <div className="home-skeleton-line home-skeleton-line--lg" />
          <div className="home-skeleton-line home-skeleton-line--md" />
        </div>
        <div className="home-skeleton">
          <div className="home-skeleton-line" />
          <div className="home-skeleton-line" />
          <div className="home-skeleton-line" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="home-error" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero：左对齐、衬线标题、文字链而非按钮 */}
      <header className="home-hero">
        <p className="home-eyebrow">{hero.title} · 6 Years</p>
        <h1 className="home-title">{hero.name}</h1>
        <p className="home-lead">{hero.intro}</p>
        <div className="home-actions">
          <a className="home-link" href="/projects">
            查看作品集
          </a>
          <a className="home-link home-link--ghost" href="/about">
            关于我
          </a>
        </div>
      </header>

      {/* 精选博客：时间 + 标题 + 摘要，横排条目 */}
      <section className="home-section" aria-labelledby="home-writings">
        <div className="home-section-head">
          <div>
            <span className="home-section-index">01</span>
            <h2 className="home-section-title" id="home-writings">
              近期写作
            </h2>
          </div>
          <a className="home-link home-section-more" href="/blog">
            全部文章
          </a>
        </div>

        {articles.length === 0 ? (
          <p className="home-empty">暂无文章，稍后再来看看。</p>
        ) : (
          <ul className="home-post-list">
            {articles.map((item) => (
              <li className="home-post-item" key={item.id}>
                <a className="home-post-link" href={`/blog/${item.id}`}>
                  <time className="home-post-meta" dateTime={item.publishedAt}>
                    {formatDate(item.publishedAt)}
                  </time>
                  <div className="home-post-body">
                    <h3 className="home-post-title">{item.title}</h3>
                    <p className="home-post-summary">
                      {item.summary || '暂无摘要'}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 精选项目：大序号 + 浮起卡片 */}
      <section className="home-section" aria-labelledby="home-work">
        <div className="home-section-head">
          <div>
            <span className="home-section-index">02</span>
            <h2 className="home-section-title" id="home-work">
              精选项目
            </h2>
          </div>
          <a className="home-link home-section-more" href="/projects">
            全部项目
          </a>
        </div>

        {projects.length === 0 ? (
          <p className="home-empty">暂无项目展示。</p>
        ) : (
          <ul className="home-project-list">
            {projects.map((item, index) => {
              const stacks = splitStack(item.techStack);
              return (
                <li className="home-project-item" key={item.id}>
                  <a className="home-project-link" href="/projects">
                    <span className="home-project-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="home-project-name">{item.name}</h3>
                    <p className="home-project-desc">{item.desc}</p>
                    {stacks.length > 0 && (
                      <p className="home-project-stack">
                        {stacks.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </p>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
