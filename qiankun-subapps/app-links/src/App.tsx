import { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../_shared/api';

interface FriendLink {
  id: number;
  name: string;
  url: string;
  description?: string;
  avatar?: string;
}

/** 友链列表 */
export default function App({ apiBase }: { apiBase: string }) {
  const [links, setLinks] = useState<FriendLink[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJson<FriendLink[]>(apiUrl(apiBase, '/link/list'))
      .then(setLinks)
      .catch(() => setError('友链加载失败'));
  }, [apiBase]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!links.length) return <p className="text-gray-500">暂无友链</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">友情链接</h1>
      <div className="space-y-4">
        {links.map((item) => (
          <article
            key={item.id}
            className="flex gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
          >
            {item.avatar ? (
              <img
                src={item.avatar}
                alt=""
                className="w-12 h-12 rounded-lg object-cover bg-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 shrink-0" />
            )}
            <div>
              <h2 className="text-lg font-semibold">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {item.name}
                </a>
              </h2>
              {item.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
