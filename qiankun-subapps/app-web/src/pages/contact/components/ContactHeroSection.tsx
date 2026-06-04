/** 联系页左侧：标题与引导文案 */
export interface ContactHeroSectionProps {
  /** 后台配置的页面说明，缺省时展示默认引导语 */
  intro?: string;
}

const DEFAULT_INTRO =
  '有项目合作、技术交流或职业机会，欢迎直接联系。也可以先在下方留言，我会尽快回复。';

export default function ContactHeroSection({ intro }: ContactHeroSectionProps) {
  return (
    <header className="contact-hero">
      <h1 className="contact-title">联系我</h1>
      <p className="contact-lead">{intro?.trim() || DEFAULT_INTRO}</p>
    </header>
  );
}
