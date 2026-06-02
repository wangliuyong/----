import { useEffect, useState } from 'react';
import {
  AppLinkRow,
  AppMark,
  AppTag,
  PageTitle,
  SectionTitle,
  SubApp,
} from '../../_shared/components';
import { fetchSiteConfig, type SiteProfile } from '../../_shared/siteConfig';
import { profile as fallbackProfile } from './data/profile';

interface AppProps {
  apiBase: string;
}

/** 关于我 */
export default function App({ apiBase }: AppProps) {
  const [profile, setProfile] = useState<SiteProfile>(fallbackProfile);

  useEffect(() => {
    fetchSiteConfig(apiBase)
      .then((cfg) => setProfile(cfg.about))
      .catch(() => setProfile(fallbackProfile));
  }, [apiBase]);

  const {
    name,
    title,
    location,
    email,
    github,
    intro,
    education,
    certifications,
    strengths,
    experiences,
    skillGroups,
  } = profile;

  return (
    <SubApp className="max-w-3xl">
      <section>
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
      </section>

      <section className="mt-10">
        <SectionTitle>核心优势</SectionTitle>
        <ul className="space-y-2">
          {strengths.map((item) => (
            <li key={item} className="flex gap-2 text-muted text-sm leading-relaxed">
              <AppMark />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <SectionTitle>技能</SectionTitle>
        <div className="space-y-6">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold">{group.title}</h3>
              <p className="text-sm text-faint mt-0.5">{group.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {group.items.map((skill) => (
                  <AppTag key={skill}>{skill}</AppTag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionTitle>工作履历</SectionTitle>
        <div className="app-timeline pl-6 space-y-8">
          {experiences.map((item) => (
            <div key={`${item.company}-${item.period}`}>
              <p className="text-sm text-faint">{item.period}</p>
              <h3 className="font-semibold mt-1">
                {item.role} · {item.company}
              </h3>
              <p className="mt-2 text-muted text-sm leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 pb-4">
        <SectionTitle>教育背景</SectionTitle>
        <p className="text-muted">{education}</p>
        {certifications.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-3">认证</h3>
            <ul className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <li key={cert}>
                  <AppTag className="rounded-md">{cert}</AppTag>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </SubApp>
  );
}
