'use client';

import { Github, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { API_BASE } from '../app/utils/api';
import { SearchBar } from './SearchBar';

/** 导航项 */
interface NavItem {
  href: string;
  label: string;
}

/** 默认导航（API 加载失败时使用） */
const FALLBACK_NAV: NavItem[] = [
  { href: '/', label: '首页' },
  { href: '/about', label: '关于我' },
  { href: '/blog', label: '博客' },
  { href: '/projects', label: '项目' },
  { href: '/contact', label: '联系我' },
  { href: '/links', label: '友链' },
];

/** 顶栏导航（站点名、导航、GitHub 从 API 动态加载） */
export function MainNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const [siteName, setSiteName] = useState('王刘永的博客');
  const [githubUrl, setGithubUrl] = useState('https://github.com/wly-dev');
  const [navItems, setNavItems] = useState<NavItem[]>(FALLBACK_NAV);

  useEffect(() => {
    fetch(`${API_BASE}/site/config`)
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg) => {
        if (!cfg) return;
        if (cfg.siteName) setSiteName(cfg.siteName);
        if (cfg.githubUrl) setGithubUrl(cfg.githubUrl);
        if (Array.isArray(cfg.nav) && cfg.nav.length) setNavItems(cfg.nav);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          {siteName}
        </Link>
        <nav className="site-nav">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'site-nav__link site-nav__link--active' : 'site-nav__link'}
              >
                {item.label}
              </Link>
            );
          })}
          <SearchBar />
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="site-icon-btn"
          >
            <Github size={20} />
          </a>
          <button
            type="button"
            aria-label="切换暗黑模式"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="site-icon-btn"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </div>
    </header>
  );
}
