import { FormEvent, useState } from 'react';
import { useApiBase } from '../../../context/ApiBaseContext';
import { useHostProps } from '../../../context/HostPropsContext';
import { webApi } from '../../../utils/webApi';

/** 基座与子应用约定的留言成功事件名（供基座监听 CustomEvent） */
export const MESSAGE_SUCCESS_EVENT = 'micro-app:message-success';

/** 留言表单校验、提交与基座通知 */
export function useContactForm() {
  const apiBase = useApiBase();
  const hostProps = useHostProps();
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

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
      await webApi.submitMessage(apiBase, {
        nickname: nickname.trim(),
        contact: contact.trim() || undefined,
        content: content.trim(),
      });

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

  return {
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
  };
}
