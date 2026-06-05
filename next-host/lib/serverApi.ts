import { apiUrl, fetchJson } from '@shared/api';
import type { Article, Project } from '@shared/contentTypes';
import { fetchSiteConfig, type SiteConfig } from '@shared/siteConfig';
import { getServerApiBase } from '@/utils/api';

/** 服务端拉取站点配置 */
export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    return await fetchSiteConfig(getServerApiBase());
  } catch {
    return null;
  }
}

/** 服务端拉取文章列表（支持分类 / 标签筛选；失败时返回空列表） */
export async function getArticles(filters?: {
  category?: string;
  tag?: string;
}): Promise<Article[]> {
  try {
    const base = getServerApiBase();
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.tag) params.set('tag', filters.tag);
    const qs = params.toString() ? `?${params}` : '';
    return await fetchJson<Article[]>(apiUrl(base, `/article/list${qs}`));
  } catch {
    return [];
  }
}

/** 服务端拉取单篇文章详情 */
export async function getArticle(id: string): Promise<Article | null> {
  try {
    return await fetchJson<Article>(
      apiUrl(getServerApiBase(), `/article/${id}`),
    );
  } catch {
    return null;
  }
}

/** 服务端拉取项目列表（失败时返回空列表） */
export async function getProjects(): Promise<Project[]> {
  try {
    return await fetchJson<Project[]>(
      apiUrl(getServerApiBase(), '/project/list'),
    );
  } catch {
    return [];
  }
}
