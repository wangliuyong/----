import { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../_shared/api';
import type { HostProps } from '../../_shared/mountApp';

interface Article {
  id: number;
  title: string;
  summary?: string;
}

interface Project {
  id: number;
  name: string;
  desc: string;
  techStack?: string;
}

interface AppProps {
  apiBase: string;
  hostProps?: HostProps;
}

/** 首页：个人简介 + 精选博客/项目 */
export default function App({ apiBase }: AppProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        const [arts, pros] = await Promise.all([
          fetchJson<Article[]>(apiUrl(apiBase, '/article/list')),
          fetchJson<Project[]>(apiUrl(apiBase, '/project/list')),
        ]);
        setArticles(arts);
        setProjects(pros);
      } catch {
        setError('内容加载失败，请确认后端已启动（端口 3001）');
      }
    };
    void load();
  }, [apiBase]);

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  return (
    <div>
      <section className="text-center mb-16">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">
          Hi，我是王刘永
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          前端开发工程师（6 年）· 专注架构、可视化与工程化 · Next.js + NestJS + Qiankun
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">精选博客</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((item) => (
            <article
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <h3 className="font-bold dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {item.summary || '暂无摘要'}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 dark:text-white">精选项目</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((item) => (
            <article
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <h3 className="font-bold dark:text-white">{item.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {item.desc}
              </p>
              {item.techStack && (
                <small className="text-blue-500 block mt-2">
                  技术栈：{item.techStack}
                </small>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
