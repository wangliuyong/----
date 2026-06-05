import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import { updateSite } from '../../../../api/site.api';
import type { SiteConfig } from '../../../../types';
import SiteSettingsForm from './SiteSettingsForm';

export interface SiteBasicSettingsSectionProps {
  site: SiteConfig;
  setSite: (site: SiteConfig) => void;
}

/** 站点配置 Tab：站点名称、GitHub、邮箱 */
export default function SiteBasicSettingsSection({
  site,
  setSite,
}: SiteBasicSettingsSectionProps) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      siteName: site.siteName,
      githubUrl: site.githubUrl,
      email: site.email,
    });
  }, [site, form]);

  const handleSubmit = async (values: Partial<SiteConfig>) => {
    setSaving(true);
    try {
      setSite(await updateSite(values));
      message.success('站点设置已保存');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SiteSettingsForm form={form} saving={saving} onSubmit={handleSubmit} />
  );
}
