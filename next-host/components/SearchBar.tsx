'use client';

import Fuse from 'fuse.js';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { blogDetailPath } from '@/router';
import { API_BASE } from '@/utils/api';

interface SearchItem {
  type: 'article' | 'project';
  id: number;
  title: string;
  summary: string;
  href: string;
}

/** 全站模糊搜索（文章 + 项目） */
export function SearchBar() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [open, setOpen] = useState(false);

  const loadIndex = useCallback(async () => {
    try {
      const [articles, projects] = await Promise.all([
        fetch(`${API_BASE}/article/list`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE}/project/list`).then((r) => (r.ok ? r.json() : [])),
      ]);

      if (!Array.isArray(articles) || !Array.isArray(projects)) {
        setItems([]);
        return;
      }

      const merged: SearchItem[] = [
        ...articles.map((a: { id: number; title: string; summary?: string }) => ({
          type: 'article' as const,
          id: a.id,
          title: a.title,
          summary: a.summary || '',
          href: blogDetailPath(a.id),
        })),
        ...projects.map((p: { id: number; name: string; desc: string }) => ({
          type: 'project' as const,
          id: p.id,
          title: p.name,
          summary: p.desc,
          href: '/projects',
        })),
      ];
      setItems(merged);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void loadIndex();
  }, [loadIndex]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const fuse = new Fuse(items, {
      keys: ['title', 'summary'],
      threshold: 0.4,
    });
    setResults(fuse.search(query).map((r) => r.item).slice(0, 8));
  }, [query, items]);

  return (
    <div className="site-search">
      <input
        type="search"
        placeholder="搜索文章/项目..."
        aria-label="全站搜索"
        className="site-search__input"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && query && (
        <ul className="site-search__dropdown">
          {results.length === 0 ? (
            <li className="site-search__empty">无匹配结果</li>
          ) : (
            results.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={item.href}
                  className="site-search__item"
                  onClick={() => setOpen(false)}
                >
                  <span className="site-search__type">
                    {item.type === 'article' ? '文章' : '项目'}
                  </span>
                  <div className="site-search__title">{item.title}</div>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
