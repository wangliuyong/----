import { LOGIN_FEATURES } from '../constants';

/** 登录页左侧：后台能力概览（纯展示） */
export default function LoginFeatureList() {
  return (
    <ul className="admin-login-features" aria-label="后台能力">
      {LOGIN_FEATURES.map(({ icon: Icon, title, description }) => (
        <li key={title} className="admin-login-feature">
          <span className="admin-login-feature__icon" aria-hidden="true">
            <Icon />
          </span>
          <div>
            <p className="admin-login-feature__title">{title}</p>
            <p className="admin-login-feature__desc">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
