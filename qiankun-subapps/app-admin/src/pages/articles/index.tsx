import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
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

  return (
    <Card
      title="博客管理"
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
      <Table<Article>
        rowKey="id"
        columns={[
          ...ARTICLE_COLUMNS,
          {
            title: '操作',
            width: 140,
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
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
