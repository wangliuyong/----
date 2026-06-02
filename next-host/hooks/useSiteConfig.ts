'use client';

import { useEffect, useState } from 'react';
import { FALLBACK_NAV } from '@/router';
import { API_BASE } from '@/utils/api';

interface NavItem {
  href: string;
  label: string;
}

/** 顶栏站点名 / GitHub / 导航（API 失败时使用 router 默认配置） */
export function useSiteConfig() {
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
      .catch(() => { });
  }, []);

  return { siteName, githubUrl, navItems };
}
