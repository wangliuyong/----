import { ArrowLeftOutlined, FileMarkdownOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, Spin, message } from 'antd';
import { Suspense, lazy, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoading from '../../../components/_common/PageLoading';
import PermissionGuard from '../../../components/PermissionGuard';
import { createArticle, getArticle, updateArticle } from '../../../api/articles.api';
import { ARTICLE_PERMISSIONS, ARTICLE_ROUTES } from '../constants';
import type { ArticleFormValues } from '../types';
import ArticleMetaSidebar from './ArticleMetaSidebar';
import {
  articlePublishedAtToDayjs,
  dayjsToPublishedAt,
} from './ArticleMetaFields';
import '../styles/articleEditor.scss';

const ArticleMarkdownEditor = lazy(() => import('./ArticleMarkdownEditor'));

interface ArticleEditorPageProps {
  mode: 'create' | 'edit';
  articleId?: number;
}

/** 博客新建/编辑页：顶栏 + 侧栏发布设置 + 主编辑区 */
export default function ArticleEditorPage({ mode, articleId }: ArticleEditorPageProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<ArticleFormValues>();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);

  const isCreate = mode === 'create';
  const pageTitle = isCreate ? '新建文章' : '编辑文章';
  const pageHint = isCreate
    ? '撰写 Markdown 正文，保存后发布到站点博客'
    : '修改内容后保存，前台将展示最新版本';
  const savePermission = isCreate
    ? ARTICLE_PERMISSIONS.create
    : ARTICLE_PERMISSIONS.update;

  useEffect(() => {
    if (mode !== 'edit' || !articleId) return;

    let cancelled = false;
    setLoading(true);

    void getArticle(articleId)
      .then((article) => {
        if (cancelled) return;
        form.setFieldsValue({
          title: article.title,
          summary: article.summary ?? undefined,
          category: article.category ?? undefined,
          tags: article.tags ?? undefined,
          slug: article.slug ?? undefined,
          content: article.content,
          publishedAt: articlePublishedAtToDayjs(article.publishedAt),
        });
      })
      .catch(() => {
        if (!cancelled) {
          message.error('文章不存在或无权访问');
          navigate(ARTICLE_ROUTES.list);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mode, articleId, form, navigate]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload = {
      title: values.title,
      summary: values.summary,
      category: values.category,
      tags: values.tags,
      slug: values.slug,
      content: values.content,
      publishedAt: dayjsToPublishedAt(values.publishedAt),
    };

    setSaving(true);
    try {
      if (isCreate) {
        await createArticle(payload);
        message.success('文章已创建');
      } else if (articleId) {
        await updateArticle(articleId, payload);
        message.success('文章已更新');
      }
      navigate(ARTICLE_ROUTES.list);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="article-editor-page">
      <header className="article-editor-hero">
        <div className="article-editor-hero__main">
          <Button
            type="text"
            className="article-editor-hero__back"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(ARTICLE_ROUTES.list)}
          >
            返回列表
          </Button>
          <div className="article-editor-hero__copy">
            <h1 className="article-editor-hero__title">{pageTitle}</h1>
            <p className="article-editor-hero__subtitle">{pageHint}</p>
          </div>
        </div>
        <div className="article-editor-hero__actions">
          <Button onClick={() => navigate(ARTICLE_ROUTES.list)}>取消</Button>
          <PermissionGuard code={savePermission}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={() => void handleSubmit()}
            >
              保存文章
            </Button>
          </PermissionGuard>
        </div>
      </header>

      <Form form={form} layout="vertical" className="article-editor-form">
        <div className="article-editor-layout">
          <aside className="article-editor-sidebar">
            <div className="article-editor-panel article-editor-panel--sidebar">
              <h3 className="article-editor-panel__title">发布设置</h3>
              <ArticleMetaSidebar />
            </div>
          </aside>

          <main className="article-editor-main">
            <div className="article-editor-panel article-editor-panel--compose">
              <Form.Item
                name="title"
                rules={[{ required: true, message: '请输入标题' }]}
                className="article-editor-title"
              >
                <Input
                  bordered={false}
                  placeholder="输入文章标题…"
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <div className="article-editor-body">
                <div className="article-editor-body__label">
                  <FileMarkdownOutlined aria-hidden />
                  正文 Markdown
                </div>
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: '请输入正文' }]}
                  className="article-editor-body__field"
                >
                  <Suspense
                    fallback={
                      <div className="article-md-editor article-md-editor--loading">
                        <Spin tip="编辑器加载中…" />
                      </div>
                    }
                  >
                    <ArticleMarkdownEditor height={560} />
                  </Suspense>
                </Form.Item>
              </div>
            </div>
          </main>
        </div>
      </Form>
    </div>
  );
}
