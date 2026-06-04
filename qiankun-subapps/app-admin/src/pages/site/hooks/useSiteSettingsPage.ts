import { Form, message } from 'antd';
import { useEffect, useState } from 'react';
import { updateSite } from '../../../api/site.api';
import type { SiteConfig } from '../../../types';
import { useSite } from '../useSite';

/** 站点设置页：表单同步与保存 */
export function useSiteSettingsPage() {
  const { site, setSite, loading, reload } = useSite();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!site) return;
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

  return { site, loading, reload, form, saving, handleSubmit };
}
