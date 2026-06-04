/** 从 GitHub URL 提取展示用用户名；无路径时显示「查看主页」 */
function githubDisplayName(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
    return path || '查看主页';
  } catch {
    return '查看主页';
  }
}

export interface ContactChannelsSectionProps {
  email: string;
  githubUrl: string;
}

/** 联系页左侧：邮箱与 GitHub 渠道入口 */
export default function ContactChannelsSection({
  email,
  githubUrl,
}: ContactChannelsSectionProps) {
  const githubName = githubDisplayName(githubUrl);

  return (
    <ul className="contact-channels" aria-label="联系方式">
      <li className="contact-channel">
        <a
          className="contact-channel-link"
          href={`mailto:${email}`}
          aria-label={`发送邮件至 ${email}`}
        >
          <span className="contact-channel-label">邮箱</span>
          <span className="contact-channel-value">{email}</span>
          <span className="contact-channel-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </li>
      <li className="contact-channel">
        <a
          className="contact-channel-link"
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`在 GitHub 查看 ${githubName}`}
        >
          <span className="contact-channel-label">GitHub</span>
          <span className="contact-channel-value">{githubName}</span>
          <span className="contact-channel-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </li>
    </ul>
  );
}
