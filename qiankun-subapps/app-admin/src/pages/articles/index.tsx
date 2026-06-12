import { DeleteOutlined, EditOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  AdminPageShell,
  AdminSectionCard,
  ADMIN_TABLE_DEFAULTS,
  mergeAdminTablePagination,
} from '../../components/admin-page';
import { deleteArticle } from '../../api/articles.api';
import PageLoading from '../../components/_common/PageLoading';
import PermissionGuard from '../../components/PermissionGuard';
import type { Article } from '../../types';
import { ARTICLE_PERMISSIONS, ARTICLE_ROUTES } from './constants';
import { ARTICLE_COLUMNS } from './components/articleColumns';
import { useArticles } from './useArticles';

/** 路由 articles — 博客列表（新建/编辑跳转独立页面） */
export default function ArticlesPage() {
  const navigate = useNavigate();
  const { articles, loading, reload } = useArticles();

  if (loading) {
    return <PageLoading />;
  }

  const handleDelete = async (id: number) => {
    await deleteArticle(id);
    message.success('已删除');
    reload();
  };

  const categoryCount = new Set(articles.map((a) => a.category).filter(Boolean)).size;

  return (
    <AdminPageShell
      title="博客管理"
      description="管理站点文章列表，新建与编辑在独立页面完成"
      stats={[
        {
          label: '文章总数',
          value: articles.length,
          icon: <FileTextOutlined />,
          accent: 'primary',
        },
        {
          label: '分类数',
          value: categoryCount,
          hint: categoryCount > 0 ? '已使用分类' : '暂无分类',
        },
      ]}
      extra={
        <PermissionGuard code={ARTICLE_PERMISSIONS.create}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(ARTICLE_ROUTES.create)}
          >
            新建文章
          </Button>
        </PermissionGuard>
      }
    >
      <AdminSectionCard noPadding>
        <Table<Article>
          rowKey="id"
          size={ADMIN_TABLE_DEFAULTS.size}
          className={ADMIN_TABLE_DEFAULTS.className}
          scroll={{ x: 'max-content' }}
          columns={[
            ...ARTICLE_COLUMNS,
            {
              title: '操作',
              width: 140,
              fixed: 'right',
              render: (_, record) => (
                <Space>
                  <PermissionGuard code={ARTICLE_PERMISSIONS.update}>
                    <Button
                      type="link"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => navigate(ARTICLE_ROUTES.edit(record.id))}
                    >
                      编辑
                    </Button>
                  </PermissionGuard>
                  <PermissionGuard code={ARTICLE_PERMISSIONS.delete}>
                    <Popconfirm
                      title="确定删除该文章？"
                      onConfirm={() => void handleDelete(record.id)}
                    >
                      <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  </PermissionGuard>
                </Space>
              ),
            },
          ]}
          dataSource={articles}
          pagination={mergeAdminTablePagination({ total: articles.length })}
        />
      </AdminSectionCard>
    </AdminPageShell>
  );
}
