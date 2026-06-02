import { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../_shared/api';

interface Project {
  id: number;
  name: string;
  desc: string;
  techStack?: string;
  githubUrl?: string;
  previewUrl?: string;
}

/** 作品集列表与外链 */
export default function App({ apiBase }: { apiBase: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJson<Project[]>(apiUrl(apiBase, '/project/list'))
      .then(setProjects)
      .catch(() => setError('项目列表加载失败'));
  }, [apiBase]);

  if (error) {
    return (
      <div className="sub-app">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="sub-app">
      <h1 className="text-3xl font-bold mb-8 font-serif">作品集</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((item) => (
          <article
            key={item.id}
            className="app-card border border-line rounded-lg p-5 bg-surface"
          >
            <h2 className="text-xl font-bold font-serif">{item.name}</h2>
            <p className="text-muted mt-2">{item.desc}</p>
            {item.techStack && (
              <p className="text-sm text-faint mt-2">技术栈：{item.techStack}</p>
            )}
            <div className="flex gap-4 mt-4">
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-btn-ghost text-sm"
                >
                  GitHub 源码
                </a>
              )}
              {item.previewUrl && (
                <a
                  href={item.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-btn-ghost text-sm"
                >
                  在线预览
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
