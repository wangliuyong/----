import {
  AppError,
  AppSkeleton,
  HomeHero,
  HomePostList,
  HomeProjectList,
  HomeSection,
  HomeShell,
} from '../../../../_shared/components';
import { useHome } from './hooks/useHome';

/** 首页 — 刊物式个人入口（原 app-home） */
export default function HomePage() {
  const { hero, articles, projects, loading, error } = useHome();

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
