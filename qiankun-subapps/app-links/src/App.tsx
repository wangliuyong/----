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

  if (error) {
    return (
      <div className="sub-app">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  if (!links.length) {
    return (
      <div className="sub-app">
        <p className="text-faint">暂无友链</p>
      </div>
    );
  }

  return (
    <div className="sub-app">
      <h1 className="text-3xl font-bold mb-8 font-serif">友情链接</h1>
      <div className="space-y-4">
        {links.map((item) => (
          <article
            key={item.id}
            className="app-card flex gap-4 border border-line rounded-lg p-4 bg-surface"
          >
            {item.avatar ? (
              <img
                src={item.avatar}
                alt=""
                className="w-12 h-12 rounded-sm object-cover bg-line"
              />
            ) : (
              <div className="w-12 h-12 rounded-sm bg-line shrink-0" />
            )}
            <div>
              <h2 className="text-lg font-semibold font-serif">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-accent transition-colors"
                >
                  {item.name}
                </a>
              </h2>
              {item.description && (
                <p className="text-sm text-muted mt-1">{item.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
