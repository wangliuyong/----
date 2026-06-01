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

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">作品集</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((item) => (
          <article
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800"
          >
            <h2 className="text-xl font-bold dark:text-white">{item.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{item.desc}</p>
            {item.techStack && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                技术栈：{item.techStack}
              </p>
            )}
            <div className="flex gap-4 mt-4">
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-3 py-1 rounded-md"
                >
                  GitHub 源码
                </a>
              )}
              {item.previewUrl && (
                <a
                  href={item.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-3 py-1 rounded-md"
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
