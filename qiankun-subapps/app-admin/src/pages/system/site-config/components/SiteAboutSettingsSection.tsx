import { Button, Input, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { updateAbout } from '../../../../api/site.api';
import type { SiteConfig } from '../../../../types';

const { TextArea } = Input;

export interface SiteAboutSettingsSectionProps {
  site: SiteConfig;
  setSite: (site: SiteConfig) => void;
}

/**
 * 站点配置 Tab：关于页 Profile
 * 暂用 JSON 编辑，结构与前台 about 页一致
 */
export default function SiteAboutSettingsSection({
  site,
  setSite,
}: SiteAboutSettingsSectionProps) {
  const [json, setJson] = useState('');
  const [parseError, setParseError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setJson(JSON.stringify(site.about, null, 2));
  }, [site]);

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(json);
      setParseError('');
      setSaving(true);
      setSite(await updateAbout(parsed));
      message.success('关于我已保存');
    } catch {
      setParseError('JSON 格式错误，请检查语法');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Typography.Paragraph type="secondary">
        编辑 Profile JSON，保存后前台关于页即时生效。
      </Typography.Paragraph>
      <TextArea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={22}
        style={{ fontFamily: 'monospace', fontSize: 12 }}
      />
      {parseError && (
        <Typography.Text type="danger" style={{ display: 'block', marginTop: 8 }}>
          {parseError}
        </Typography.Text>
      )}
      <Button type="primary" loading={saving} onClick={handleSave} style={{ marginTop: 16 }}>
        保存关于我
      </Button>
    </div>
  );
}
