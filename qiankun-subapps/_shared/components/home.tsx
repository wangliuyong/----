import type { ReactNode } from 'react';
import { AppLink } from './ui';
import { formatDate, splitStack } from '../utils/format';

export interface HomeHeroData {
  name: string;
  title: string;
  intro: string;
  eyebrow?: string;
}

/** 首页 Hero 区块 */
export function HomeHero({ name, title, intro, eyebrow }: HomeHeroData) {
  return (
    <header className="home-hero">
      <p className="home-eyebrow">{eyebrow ?? `${title} · 6 Years`}</p>
      <h1 className="home-title">{name}</h1>
      <p className="home-lead">{intro}</p>
      <div className="home-actions">
        <AppLink href="/projects">查看作品集</AppLink>
        <AppLink href="/about" variant="ghost">
          关于我
        </AppLink>
      </div>
    </header>
  );
}

interface HomeSectionProps {
  index: string;
  title: string;
  titleId: string;
  moreHref: string;
  moreLabel: string;
  children: ReactNode;
}

/** 首页分区：序号 + 标题 + 查看更多 */
export function HomeSection({
  index,
  title,
  titleId,
  moreHref,
  moreLabel,
  children,
}: HomeSectionProps) {
  return (
    <section className="home-section" aria-labelledby={titleId}>
      <div className="home-section-head">
        <div>
          <span className="home-section-index">{index}</span>
          <h2 className="home-section-title" id={titleId}>
            {title}
          </h2>
        </div>
        <AppLink className="home-section-more" href={moreHref}>
          {moreLabel}
        </AppLink>
      </div>
      {children}
    </section>
  );
}

interface ArticleItem {
  id: number;
  title: string;
  summary?: string;
  publishedAt?: string;
}

/** 首页博客列表 */
export function HomePostList({ items }: { items: ArticleItem[] }) {
  if (!items.length) {
    return <p className="home-empty">暂无文章，稍后再来看看。</p>;
  }

  return (
    <ul className="home-post-list">
      {items.map((item) => (
        <li className="home-post-item" key={item.id}>
          <a className="home-post-link" href={`/blog/${item.id}`}>
            <time className="home-post-meta" dateTime={item.publishedAt}>
              {formatDate(item.publishedAt)}
            </time>
            <div className="home-post-body">
              <h3 className="home-post-title">{item.title}</h3>
              <p className="home-post-summary">{item.summary || '暂无摘要'}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

interface ProjectItem {
  id: number;
  name: string;
  desc: string;
  techStack?: string;
}

/** 首页项目列表 */
export function HomeProjectList({ items }: { items: ProjectItem[] }) {
  if (!items.length) {
    return <p className="home-empty">暂无项目展示。</p>;
  }

  return (
    <ul className="home-project-list">
      {items.map((item, index) => {
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
  );
}

/** 首页根容器 */
export function HomeShell({
  children,
  busy,
}: {
  children: ReactNode;
  busy?: boolean;
}) {
  return (
    <div className="home" aria-busy={busy || undefined}>
      {children}
    </div>
  );
}
