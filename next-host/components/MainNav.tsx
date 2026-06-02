'use client';

import { Github, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { isNavLinkActive } from '@/router';
import { SearchBar } from './SearchBar';

/** 顶栏导航（站点名、导航、GitHub 从 API 动态加载） */
export function MainNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const { siteName, githubUrl, navItems } = useSiteConfig();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-brand">
          {siteName}
        </Link>
        <nav className="site-nav">
          {navItems.map((item) => {
            const active = isNavLinkActive(pathname, item.href);

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
