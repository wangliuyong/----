import {
  HomeHero,
  HomePostList,
  HomeProjectList,
  HomeSection,
  HomeShell,
} from '@shared/components';
import type { Metadata } from 'next';
import { getHomePageData } from '@/lib/homeData';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '首页 | 王刘永的个人网站',
  description: '全栈开发工程师的个人站点：近期写作与精选项目',
};

/** 首页 — 服务端渲染 Hero、近期文章与项目预览 */
export default async function HomePage() {
  const { hero, articles, projects } = await getHomePageData();

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
        <HomePostList
          items={articles.map(({ id, title, summary, publishedAt }) => ({
            id,
            title,
            summary: summary ?? undefined,
            publishedAt,
          }))}
        />
      </HomeSection>
      <HomeSection
        index="02"
        title="精选项目"
        titleId="home-work"
        moreHref="/projects"
        moreLabel="全部项目"
      >
        <HomeProjectList
          items={projects.map(({ id, name, desc, techStack }) => ({
            id,
            name,
            desc,
            techStack: techStack ?? undefined,
          }))}
        />
      </HomeSection>
    </HomeShell>
  );
}
