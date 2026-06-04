import type { FormEvent } from 'react';
import {
  AppButton,
  AppField,
  AppInput,
} from '../../../../../_shared/components';

export interface ContactFormSectionProps {
  nickname: string;
  setNickname: (value: string) => void;
  contact: string;
  setContact: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  submitting: boolean;
  formError: string;
  formSuccess: string;
  handleSubmit: (e: FormEvent) => void;
}

/** 联系页右侧：留言表单与提交反馈 */
export default function ContactFormSection({
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
}: ContactFormSectionProps) {
  return (
    <section className="contact-form-panel" aria-labelledby="contact-form-heading">
      <h2 id="contact-form-heading" className="contact-form-heading">
        留言
      </h2>
      <p className="contact-form-desc">
        填写昵称与留言内容即可。如需回复，请留下邮箱或其他联系方式。
      </p>

      <form onSubmit={handleSubmit} className="contact-form-fields" noValidate>
        {formError && (
          <p className="contact-feedback contact-feedback--error" role="alert">
            {formError}
          </p>
        )}
        {formSuccess && (
          <p className="contact-feedback contact-feedback--success" role="status">
            {formSuccess}
          </p>
        )}

        <AppField label="昵称" required>
          <AppInput
            required
            autoComplete="nickname"
            placeholder="怎么称呼你"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={submitting}
          />
        </AppField>

        <AppField label="联系方式（选填）">
          <AppInput
            autoComplete="email"
            placeholder="邮箱、微信或 Telegram"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={submitting}
          />
        </AppField>

        <AppField label="留言内容" required>
          <textarea
            required
            rows={5}
            className="app-input resize-y min-h-[120px]"
            placeholder="想聊的内容、项目背景或问题"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
            maxLength={2000}
            aria-describedby="contact-content-hint"
          />
          <p id="contact-content-hint" className="mt-1.5 text-xs text-faint">
            最多 2000 字
          </p>
        </AppField>

        <AppButton type="submit" disabled={submitting} className="contact-submit">
          {submitting ? '提交中...' : '发送留言'}
        </AppButton>
      </form>
    </section>
  );
}
