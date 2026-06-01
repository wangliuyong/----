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
    <div className="max-w-3xl">
      <section>
        <h1 className="text-3xl font-bold dark:text-white">{name}</h1>
        <p className="mt-2 text-lg text-blue-600 dark:text-blue-400 font-medium">{title}</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{location}</p>
        <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">{intro}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {email}
          </a>
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
            GitHub
          </a>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">核心优势</h2>
        <ul className="space-y-2">
          {strengths.map((item) => (
            <li key={item} className="flex gap-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              <span className="text-blue-500 shrink-0">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">技能</h2>
        <div className="space-y-6">
          {skillGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold dark:text-white">{group.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{group.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {group.items.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">工作履历</h2>
        <div className="border-l-2 border-gray-200 dark:border-gray-600 pl-6 space-y-8">
          {experiences.map((item) => (
            <div key={`${item.company}-${item.period}`}>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.period}</p>
              <h3 className="font-semibold dark:text-white mt-1">{item.role} · {item.company}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 pb-4">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">教育背景</h2>
        <p className="text-gray-600 dark:text-gray-300">{education}</p>
        {certifications.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-3 dark:text-white">认证</h3>
            <ul className="flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <li key={cert} className="px-3 py-1 rounded-md text-sm border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
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
