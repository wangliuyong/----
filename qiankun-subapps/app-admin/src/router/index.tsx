import { BrowserRouter } from 'react-router-dom';
import AdminRouteTable from './routeTable';
import { getRouterBasename } from './routes';

/** 管理后台路由入口：BrowserRouter + 路由表 */
export default function AdminRouter() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <AdminRouteTable />
    </BrowserRouter>
  );
}
