/** 登录页入参 */
export interface LoginPageProps {
  onSuccess: (username: string) => void;
}

/** 登录表单字段 */
export interface LoginFormValues {
  username: string;
  password: string;
}
