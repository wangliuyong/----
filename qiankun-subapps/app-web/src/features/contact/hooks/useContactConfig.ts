import { useEffect, useState } from 'react';
import { fetchSiteConfig } from '../../../../../_shared/siteConfig';
import { useApiBase } from '../../../context/ApiBaseContext';

/** 联系页展示信息默认值 */
const DEFAULT_CONTACT = {
  email: 'hello@wly.dev',
  githubUrl: 'https://github.com/wly-dev',
  intro: '欢迎通过以下方式与我联系，或在下方留言。',
};

/** 联系页顶部邮箱 / GitHub / 说明文案 */
export function useContactConfig() {
  const apiBase = useApiBase();
  const [email, setEmail] = useState(DEFAULT_CONTACT.email);
  const [githubUrl, setGithubUrl] = useState(DEFAULT_CONTACT.githubUrl);
  const [intro, setIntro] = useState(DEFAULT_CONTACT.intro);

  useEffect(() => {
    fetchSiteConfig(apiBase)
      .then((cfg) => {
        setEmail(cfg.email);
        setGithubUrl(cfg.githubUrl);
        if (cfg.contact?.intro) setIntro(cfg.contact.intro);
      })
      .catch(() => {});
  }, [apiBase]);

  return { email, githubUrl, intro };
}
