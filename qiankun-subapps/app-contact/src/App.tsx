import { FormEvent, useEffect, useState } from 'react';
import { apiUrl } from '../../_shared/api';
import { fetchSiteConfig } from '../../_shared/siteConfig';
import type { HostProps } from '../../_shared/mountApp';

/** 基座与子应用约定的留言成功事件名 */
export const MESSAGE_SUCCESS_EVENT = 'micro-app:message-success';

interface AppProps {
  apiBase: string;
  hostProps?: HostProps;
}

/** 联系我：社交方式 + 留言表单（邮箱/GitHub 从 API 加载） */
export default function App({ apiBase, hostProps }: AppProps) {
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [email, setEmail] = useState('hello@wly.dev');
  const [githubUrl, setGithubUrl] = useState('https://github.com/wly-dev');
  const [intro, setIntro] = useState('欢迎通过以下方式与我联系，或在下方留言。');

  useEffect(() => {
    fetchSiteConfig(apiBase)
      .then((cfg) => {
        setEmail(cfg.email);
        setGithubUrl(cfg.githubUrl);
        if (cfg.contact?.intro) setIntro(cfg.contact.intro);
      })
      .catch(() => {});
  }, [apiBase]);

  const validate = () => {
    if (!nickname.trim()) {
      setFormError('请填写昵称');
      return false;
    }
    if (!content.trim()) {
      setFormError('请填写留言内容');
      return false;
    }
    if (content.length > 2000) {
      setFormError('留言内容不能超过 2000 字');
      return false;
    }
    setFormError('');
    return true;
  };

  const notifyHost = (msg: string) => {
    hostProps?.onMessageSuccess?.(msg);
    window.dispatchEvent(
      new CustomEvent(MESSAGE_SUCCESS_EVENT, { detail: { msg } }),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    setFormSuccess('');

    try {
      const res = await fetch(apiUrl(apiBase, '/message'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: nickname.trim(),
          contact: contact.trim() || undefined,
          content: content.trim(),
        }),
      });
      if (!res.ok) throw new Error('fail');

      const msg = '留言提交成功，感谢你的反馈！';
      setFormSuccess(msg);
      setNickname('');
      setContact('');
      setContent('');
      notifyHost(msg);
    } catch {
      setFormError('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sub-app">
      <h1 className="text-3xl font-bold mb-6 font-serif">联系我</h1>
      {intro && <p className="mb-4 text-muted">{intro}</p>}
      <div className="mb-8 text-muted space-y-1">
        <p>
          邮箱：
          <a href={`mailto:${email}`} className="text-accent ml-1 border-b border-line hover:border-accent transition-colors">
            {email}
          </a>
        </p>
        <p>
          GitHub：
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent ml-1 border-b border-line hover:border-accent transition-colors"
          >
            {githubUrl}
          </a>
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4 font-serif">留言</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <label className="block text-sm text-muted">
          昵称 *
          <input
            required
            className="app-input mt-1"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>
        <label className="block text-sm text-muted">
          联系方式（选填）
          <input
            className="app-input mt-1"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </label>
        <label className="block text-sm text-muted">
          留言内容 *
          <textarea
            required
            rows={5}
            className="app-input mt-1 resize-y min-h-[120px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        {formSuccess && <p className="text-accent text-sm">{formSuccess}</p>}
        <button type="submit" disabled={submitting} className="app-btn">
          {submitting ? '提交中...' : '提交留言'}
        </button>
      </form>
    </div>
  );
}
