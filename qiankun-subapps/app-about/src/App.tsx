import { useEffect, useState } from 'react';
import { fetchSiteConfig, type SiteProfile } from '../../_shared/siteConfig';
import { profile as fallbackProfile } from './data/profile';

interface AppProps {
  apiBase: string;
}

/** 关于我：从 API 加载 Profile，失败时使用本地 fallback */
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
    <div className="sub-app max-w-3xl">
      <section>
        <h1 className="text-3xl font-bold font-serif">{name}</h1>
        <p className="mt-2 text-lg text-accent font-medium">{title}</p>
        <p className="mt-1 text-sm text-faint">{location}</p>
        <p className="mt-6 text-muted leading-relaxed">{intro}</p>
        <div className="app-link-row mt-4 text-sm">
          <a href={`mailto:${email}`}>{email}</a>
          <a href={github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4 font-serif">核心优势</h2>
        <ul className="space-y-2">
          {strengths.map((item) => (
            <li key={item} className="flex gap-2 text-muted text-sm leading-relaxed">
              <span className="app-mark shrink-0">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4 font-serif">技能</h2>
        <div className="space-y-6">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold">{group.title}</h3>
              <p className="text-sm text-faint mt-0.5">{group.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {group.items.map((skill) => (
                  <span key={skill} className="app-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4 font-serif">工作履历</h2>
        <div className="app-timeline pl-6 space-y-8">
          {experiences.map((item) => (
            <div key={`${item.company}-${item.period}`}>
              <p className="text-sm text-faint">{item.period}</p>
              <h3 className="font-semibold mt-1">{item.role} · {item.company}</h3>
              <p className="mt-2 text-muted text-sm leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 pb-4">
        <h2 className="text-2xl font-bold mb-4 font-serif">教育背景</h2>
        <p className="text-muted">{education}</p>
        {certifications.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-3">认证</h3>
            <ul className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <li key={cert} className="app-tag rounded-md">
                  {cert}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
