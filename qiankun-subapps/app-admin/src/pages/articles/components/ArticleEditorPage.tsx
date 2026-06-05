import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
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
import ArticleMarkdownEditor from './ArticleMarkdownEditor';
import '../styles/articleEditor.scss';

interface ArticleEditorPageProps {
  mode: 'create' | 'edit';
  articleId?: number;
}

/** 博客新建/编辑页：吸顶工具栏 + 主编辑区 + 右侧发布设置 */
export default function ArticleEditorPage({ mode, articleId }: ArticleEditorPageProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm<ArticleFormValues>();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);

  const isCreate = mode === 'create';
  const pageTitle = isCreate ? '新建文章' : '编辑文章';
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
      {/* 吸顶工具栏 */}
      <header className="article-editor-toolbar">
        <div className="article-editor-toolbar__start">
          <Button
            type="text"
            className="article-editor-toolbar__back"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(ARTICLE_ROUTES.list)}
          >
            返回列表
          </Button>
          <div className="article-editor-toolbar__heading">
            <h1 className="article-editor-toolbar__title">{pageTitle}</h1>
            {isCreate && (
              <Typography.Text type="secondary" className="article-editor-toolbar__status">
                未保存
              </Typography.Text>
            )}
          </div>
        </div>
        <div className="article-editor-toolbar__actions">
          <Button onClick={() => navigate(ARTICLE_ROUTES.list)}>取消</Button>
          <PermissionGuard code={savePermission}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={() => void handleSubmit()}
            >
              保存
            </Button>
          </PermissionGuard>
        </div>
      </header>

      <Form form={form} layout="vertical" className="article-editor-form">
        <div className="article-editor-layout">
          {/* 主编辑区 */}
          <main className="article-editor-main">
            <div className="article-editor-compose">
              <Form.Item
                name="title"
                rules={[{ required: true, message: '请输入标题' }]}
                className="article-editor-title"
              >
                <Input
                  variant="borderless"
                  placeholder="文章标题"
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <div className="article-editor-body">
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: '请输入正文' }]}
                  className="article-editor-body__field"
                >
                  <ArticleMarkdownEditor />
                </Form.Item>
              </div>
            </div>
          </main>

          {/* 右侧发布设置 */}
          <aside className="article-editor-sidebar">
            <div className="article-editor-panel">
              <h2 className="article-editor-panel__title">发布设置</h2>
              <ArticleMetaSidebar />
            </div>
          </aside>
        </div>
      </Form>
    </div>
  );
}
