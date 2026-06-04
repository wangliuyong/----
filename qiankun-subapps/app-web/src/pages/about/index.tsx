import { SubApp } from '../../../../_shared/components';
import { useAbout } from './useAbout';
import AboutEducationSection from './components/AboutEducationSection';
import AboutExperienceSection from './components/AboutExperienceSection';
import AboutIntroSection from './components/AboutIntroSection';
import AboutSkillsSection from './components/AboutSkillsSection';
import AboutStrengthsSection from './components/AboutStrengthsSection';

/** 路由 about — 关于我 */
export default function AboutPage() {
  const { profile } = useAbout();

  return (
    <SubApp className="max-w-3xl">
      <AboutIntroSection
        name={profile.name}
        title={profile.title}
        location={profile.location}
        intro={profile.intro}
        email={profile.email}
        github={profile.github}
      />
      <AboutStrengthsSection strengths={profile.strengths} />
      <AboutSkillsSection skillGroups={profile.skillGroups} />
      <AboutExperienceSection experiences={profile.experiences} />
      <AboutEducationSection
        education={profile.education}
        certifications={profile.certifications}
      />
    </SubApp>
  );
}
