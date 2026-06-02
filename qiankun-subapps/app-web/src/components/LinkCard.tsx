import type { LinkItem } from '../../../_shared/contentTypes';
import { AppCard } from '../../../_shared/components';

/** 无头像时取名称首字 */
const avatarFallback = (name: string) => name.trim().charAt(0) || '?';

/** 单条友链展示（纯 UI，无请求） */
export default function LinkCard({ item }: { item: LinkItem }) {
  return (
    <AppCard as="article" className="flex gap-4 p-4">
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
  );
}
