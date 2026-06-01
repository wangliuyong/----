'use client';

import Fuse from 'fuse.js';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { API_BASE } from '@/app/utils/api';

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
        fetch(`${API_BASE}/article/list`).then((r) => r.json()),
        fetch(`${API_BASE}/project/list`).then((r) => r.json()),
      ]);

      const merged: SearchItem[] = [
        ...articles.map((a: { id: number; title: string; summary?: string }) => ({
          type: 'article' as const,
          id: a.id,
          title: a.title,
          summary: a.summary || '',
          href: `/blog/${a.id}`,
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
    <div className="relative">
      <input
        type="search"
        placeholder="搜索文章/项目..."
        aria-label="全站搜索"
        className="w-40 md:w-52 px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && query && (
        <ul className="absolute right-0 mt-1 w-64 max-h-72 overflow-auto rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg z-50 text-sm">
          {results.length === 0 ? (
            <li className="px-3 py-2 text-gray-500">无匹配结果</li>
          ) : (
            results.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-xs text-gray-500">
                    {item.type === 'article' ? '文章' : '项目'}
                  </span>
                  <div className="font-medium">{item.title}</div>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
