import {
  AppLinkRow,
  AppSection,
  PageTitle,
} from '../../../../../_shared/components';

export interface AboutIntroSectionProps {
  name: string;
  title: string;
  location: string;
  intro: string;
  email: string;
  github: string;
}

/** 关于页：个人简介与联系方式 */
export default function AboutIntroSection({
  name,
  title,
  location,
  intro,
  email,
  github,
}: AboutIntroSectionProps) {
  return (
    <AppSection>
      <PageTitle>{name}</PageTitle>
      <p className="mt-2 text-lg text-accent font-medium">{title}</p>
      <p className="mt-1 text-sm text-faint">{location}</p>
      <p className="mt-6 text-muted leading-relaxed">{intro}</p>
      <AppLinkRow className="mt-4 text-sm">
        <a href={`mailto:${email}`}>{email}</a>
        <a href={github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </AppLinkRow>
    </AppSection>
  );
}
