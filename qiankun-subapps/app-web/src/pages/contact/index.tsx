import {
  AppAccentLink,
  AppButton,
  AppField,
  AppInput,
  PageTitle,
  SectionTitle,
  SubApp,
} from '../../../../_shared/components';
import { useContactConfig } from './useContactConfig';
import { useContactForm } from './useContactForm';

/** 联系我 — 展示信息与留言表单（原 app-contact） */
export default function ContactPage() {
  const { email, githubUrl, intro } = useContactConfig();
  const {
    nickname,
    setNickname,
    contact,
    setContact,
    content,
    setContent,
    submitting,
    formError,
    formSuccess,
    handleSubmit,
  } = useContactForm();

  return (
    <SubApp>
      <PageTitle className="mb-6">联系我</PageTitle>
      {intro && <p className="mb-4 text-muted">{intro}</p>}
      <div className="mb-8 text-muted space-y-1">
        <p>
          邮箱：
          <AppAccentLink href={`mailto:${email}`}>{email}</AppAccentLink>
        </p>
        <p>
          GitHub：
          <AppAccentLink href={githubUrl} target="_blank" rel="noopener noreferrer">
            {githubUrl}
          </AppAccentLink>
        </p>
      </div>

      <SectionTitle>留言</SectionTitle>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <AppField label="昵称" required>
          <AppInput
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </AppField>
        <AppField label="联系方式（选填）">
          <AppInput value={contact} onChange={(e) => setContact(e.target.value)} />
        </AppField>
        <AppField label="留言内容" required>
          <textarea
            required
            rows={5}
            className="app-input resize-y min-h-[120px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </AppField>
        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        {formSuccess && <p className="text-accent text-sm">{formSuccess}</p>}
        <AppButton type="submit" disabled={submitting}>
          {submitting ? '提交中...' : '提交留言'}
        </AppButton>
      </form>
    </SubApp>
  );
}
