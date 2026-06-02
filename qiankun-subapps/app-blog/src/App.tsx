import { useCallback, useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { apiUrl, fetchJson } from '../../_shared/api';

interface Article {
  id: number;
  title: string;
  summary?: string;
  content: string;
  category?: string;
  tags?: string;
  publishedAt: string;
}

interface AppProps {
  apiBase: string;
}

/** 监听基座 Next 路由变化，解析列表/详情模式 */
function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', sync);
    const rawPush = history.pushState.bind(history);
    const rawReplace = history.replaceState.bind(history);
    history.pushState = (...args) => {
      rawPush(...args);
      sync();
    };
    history.replaceState = (...args) => {
      rawReplace(...args);
      sync();
    };
    return () => {
      window.removeEventListener('popstate', sync);
      history.pushState = rawPush;
      history.replaceState = rawReplace;
    };
  }, []);

  return pathname;
}

function useBlogRoute() {
  const pathname = usePathname();
  return useMemo(() => {
    const match = pathname.match(/\/blog\/(\d+)/);
    const articleId = match?.[1] ?? '';
    return {
      mode: articleId ? ('detail' as const) : ('list' as const),
      articleId,
    };
  }, [pathname]);
}

/** 博客：列表 / 详情 / 分类标签筛选 */
export default function App({ apiBase }: AppProps) {
  const { mode, articleId } = useBlogRoute();
  const [articles, setArticles] = useState<Article[]>([]);
  const [detail, setDetail] = useState<Article | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'detail' && articleId) {
        const data = await fetchJson<Article>(
          apiUrl(apiBase, `/article/${articleId}`),
        );
        setDetail(data);
        setArticles([]);
      } else {
        const params = new URLSearchParams();
        if (filterCategory) params.set('category', filterCategory);
        if (filterTag) params.set('tag', filterTag);
        const qs = params.toString() ? `?${params}` : '';
        const list = await fetchJson<Article[]>(
          apiUrl(apiBase, `/article/list${qs}`),
        );
        setArticles(list);
        setDetail(null);
      }
    } catch {
      setError('博客加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase, mode, articleId, filterCategory, filterTag]);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(
    () => [...new Set(articles.map((a) => a.category).filter(Boolean))] as string[],
    [articles],
  );

  const renderMarkdownHtml = (content: string) => {
    const html = marked.parse(content, { async: false }) as string;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    wrap.querySelectorAll('pre code').forEach((block) => {
      Prism.highlightElement(block as HTMLElement);
    });
    return wrap.innerHTML;
  };

  if (loading) {
    return (
      <div className="sub-app">
        <p className="text-faint">加载中...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="sub-app">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (mode === 'detail' && detail) {
    return (
      <article className="sub-app">
        <a href="/blog" className="app-link app-link--back mb-4">
          返回列表
        </a>
        <h1 className="text-3xl font-bold font-serif">{detail.title}</h1>
        <p className="text-sm text-faint my-2">
          {new Date(detail.publishedAt).toLocaleDateString('zh-CN')}
          {detail.category ? ` · ${detail.category}` : ''}
        </p>
        <div
          className="article-body max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdownHtml(detail.content) }}
        />
      </article>
    );
  }

  return (
    <div className="sub-app">
      <h1 className="text-3xl font-bold mb-6 font-serif">博客</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="app-input w-auto min-w-[140px]"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="app-input w-auto min-w-[140px]"
          placeholder="按标签筛选"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
        <button type="button" className="app-btn" onClick={() => void load()}>
          筛选
        </button>
      </div>

      <div className="space-y-4">
        {articles.map((item) => (
          <div
            key={item.id}
            className="app-card app-list-item border border-line rounded-lg p-4 bg-surface"
          >
            <h2 className="text-xl font-semibold font-serif">
              <a href={`/blog/${item.id}`} className="app-list-item__title text-ink hover:no-underline">
                {item.title}
              </a>
            </h2>
            <p className="text-muted mt-1">{item.summary || ''}</p>
            <p className="text-sm text-faint mt-2">
              {new Date(item.publishedAt).toLocaleDateString('zh-CN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
