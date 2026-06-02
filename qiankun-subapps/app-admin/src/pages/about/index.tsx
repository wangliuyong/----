import { Button, Card, Input, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { useApiBase } from '../../context/ApiBaseContext';
import { useSite } from '../../hooks';
import { adminApi } from '../../utils/adminApi';
import PageError from '../_common/PageError';
import PageLoading from '../_common/PageLoading';

const { TextArea } = Input;

/** 路由 /about — 关于页 Profile */
export default function AboutPage() {
  const apiBase = useApiBase();
  const { site, setSite, loading, error } = useSite();
  const [json, setJson] = useState('');
  const [parseError, setParseError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (site) setJson(JSON.stringify(site.about, null, 2));
  }, [site]);

  if (loading) return <PageLoading />;
  if (!site) return <PageError message={error || '站点配置加载失败'} />;

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(json);
      setParseError('');
      setSaving(true);
      setSite(await adminApi.updateAbout(apiBase, parsed));
      message.success('关于我已保存');
    } catch {
      setParseError('JSON 格式错误，请检查语法');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title="关于我"
      extra={
        <Button type="primary" loading={saving} onClick={handleSave}>
          保存
        </Button>
      }
    >
      <Typography.Paragraph type="secondary">
        编辑 Profile JSON（与前台关于页结构一致，保存后即时生效）
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
    </Card>
  );
}
