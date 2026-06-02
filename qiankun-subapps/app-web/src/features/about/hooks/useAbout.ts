import { useEffect, useState } from 'react';
import { fetchSiteConfig, type SiteProfile } from '../../../../../_shared/siteConfig';
import { useApiBase } from '../../../context/ApiBaseContext';
import { fallbackProfile } from '../data/fallbackProfile';

/** 关于页 Profile：API 失败时回退静态资料，避免白屏 */
export function useAbout() {
  const apiBase = useApiBase();
  const [profile, setProfile] = useState<SiteProfile>(fallbackProfile);

  useEffect(() => {
    fetchSiteConfig(apiBase)
      .then((cfg) => setProfile(cfg.about))
      .catch(() => setProfile(fallbackProfile));
  }, [apiBase]);

  return { profile };
}
