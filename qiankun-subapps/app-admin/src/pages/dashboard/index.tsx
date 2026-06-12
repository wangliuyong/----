import { ReloadOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageLoading from '../../components/_common/PageLoading';
import { UiButton, UiPopconfirm, UiSpace } from '../../components/ui';
import DashboardSortableLayout from './components/DashboardSortableLayout';
import { useDashboardOverview } from './hooks/useDashboardOverview';
import { useDashboardSectionOrder } from './hooks/useDashboardSectionOrder';
import './styles/dashboard.scss';

/** 路由 dashboard — 管理后台首页概览（支持卡片拖拽排序） */
export default function DashboardPage() {
  const navigate = useNavigate();
  const { overview, loading, reload } = useDashboardOverview();
  const { order, isEditing, setIsEditing, reorder, resetOrder } = useDashboardSectionOrder();

  if (loading || !overview) {
    return <PageLoading />;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <Typography.Title level={3} className="dashboard-hero__title">
            {overview.site.siteName}
          </Typography.Title>
          <p className="dashboard-hero__subtitle">
            访问、内容概况与服务器状态一屏掌握
          </p>
        </div>
        <UiSpace wrap>
          {isEditing ? (
            <>
              <UiPopconfirm
                title="恢复默认顺序？"
                okText="恢复"
                cancelText="取消"
                onConfirm={resetOrder}
              >
                <UiButton variant="default">恢复默认</UiButton>
              </UiPopconfirm>
              <UiButton variant="ghost" onClick={() => setIsEditing(false)}>
                完成编辑
              </UiButton>
            </>
          ) : (
            <UiButton variant="default" onClick={() => setIsEditing(true)}>
              自定义布局
            </UiButton>
          )}
          <UiButton variant="default" icon={<ReloadOutlined />} onClick={() => void reload()}>
            刷新数据
          </UiButton>
        </UiSpace>
      </header>

      <DashboardSortableLayout
        order={order}
        isEditing={isEditing}
        overview={overview}
        onNavigate={(path) => navigate(`/${path}`)}
        onReorder={reorder}
      />
    </div>
  );
}
