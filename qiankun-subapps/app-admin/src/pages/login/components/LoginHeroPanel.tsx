import loginHeroBg from '../../../assets/images/login-hero-bg.jpg';
import LoginFeatureList from './LoginFeatureList';

/** 登录页左侧：网格纹理 + 摄影背景 + 品牌文案 */
export default function LoginHeroPanel() {
  return (
    <aside className="admin-login-hero" aria-label="站点管理后台介绍">
      <div className="admin-login-hero__media" aria-hidden="true">
        <img
          className="admin-login-hero__image"
          src={loginHeroBg}
          alt=""
          loading="eager"
          decoding="async"
        />
        <div className="admin-login-hero__scrim" />
        <div className="admin-login-hero__grid" />
      </div>

      <div className="admin-login-hero__content">
        <p className="admin-login-hero__brand">Control Console</p>
        <h1 className="admin-login-hero__title">站点管理后台</h1>
        <p className="admin-login-hero__lead">
          在这里维护个人站点的内容、项目与配置。登录后即可开始编辑。
        </p>
        <LoginFeatureList />
      </div>
    </aside>
  );
}
