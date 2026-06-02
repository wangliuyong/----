import { useCallback, useEffect, useState } from 'react';
import { useApiBase } from '../context/ApiBaseContext';
import type { Article, Message, Project, SiteConfig } from '../types';
import { adminApi } from '../utils/adminApi';

/** 站点配置：site / nav / about / contact 页共用 */
export function useSite() {
  const apiBase = useApiBase();
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setSite(await adminApi.getSite(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { site, setSite, loading, error, reload };
}

/** 博客列表页数据 */
export function useArticles() {
  const apiBase = useApiBase();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setArticles(await adminApi.listArticles(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { articles, loading, error, reload };
}

/** 项目列表页数据 */
export function useProjects() {
  const apiBase = useApiBase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setProjects(await adminApi.listProjects(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { projects, loading, error, reload };
}

/** 留言列表页数据 */
export function useMessages() {
  const apiBase = useApiBase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setMessages(await adminApi.listMessages(apiBase));
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { messages, loading, error, reload };
}
