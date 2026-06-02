import { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../../_shared/api';
import {
  AppCard,
  AppEmpty,
  AppError,
  PageTitle,
  SubApp,
} from '../../../_shared/components';

interface FriendLink {
  id: number;
  name: string;
  url: string;
  description?: string;
  avatar?: string;
}

/** 无头像时取名称首字 */
const avatarFallback = (name: string) => name.trim().charAt(0) || '?';

/** 友链列表（原 app-links） */
export default function LinksPage({ apiBase }: { apiBase: string }) {
  const [links, setLinks] = useState<FriendLink[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJson<FriendLink[]>(apiUrl(apiBase, '/link/list'))
      .then(setLinks)
      .catch(() => setError('友链加载失败'));
  }, [apiBase]);

  if (error) {
    return (
      <SubApp>
        <AppError message={error} />
      </SubApp>
    );
  }

  if (!links.length) {
    return (
      <SubApp>
        <AppEmpty>暂无友链</AppEmpty>
      </SubApp>
    );
  }

  return (
    <SubApp>
      <PageTitle className="mb-8">友情链接</PageTitle>
      <div className="space-y-4">
        {links.map((item) => (
          <AppCard as="article" key={item.id} className="flex gap-4 p-4">
            {item.avatar ? (
              <img
                src={item.avatar}
                alt=""
                className="w-12 h-12 rounded-sm object-cover bg-line"
              />
            ) : (
              <div className="w-12 h-12 rounded-sm bg-line shrink-0 flex items-center justify-center font-serif text-faint">
                {avatarFallback(item.name)}
              </div>
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
          </AppCard>
        ))}
      </div>
    </SubApp>
  );
}
