import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { apiUrl, DEFAULT_API_BASE } from '../../shared/api';
import { themeBaseCss } from '../../shared/theme-css';

/** 联系我：社交方式 + 留言表单 */
@customElement('wc-contact')
export class WcContact extends LitElement {
  @property({ type: String }) theme = 'light';
  @property({ type: String, attribute: 'api-base' }) apiBase = DEFAULT_API_BASE;

  @state() private nickname = '';
  @state() private contact = '';
  @state() private content = '';
  @state() private submitting = false;
  @state() private formError = '';
  @state() private formSuccess = '';

  static styles = [
    unsafeCSS(themeBaseCss),
    css`
      .contacts {
        margin-bottom: 2rem;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 480px;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        font-size: 0.875rem;
      }
      input,
      textarea {
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        font: inherit;
      }
      :host([theme='dark']) input,
      :host([theme='dark']) textarea {
        background: #374151;
        border-color: #4b5563;
        color: #f9fafb;
      }
      button[type='submit'] {
        padding: 0.6rem 1rem;
        border: none;
        border-radius: 6px;
        background: #2563eb;
        color: #fff;
        cursor: pointer;
        font-weight: 600;
      }
      button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .success {
        color: #059669;
      }
    `,
  ];

  private validate() {
    if (!this.nickname.trim()) {
      this.formError = '请填写昵称';
      return false;
    }
    if (!this.content.trim()) {
      this.formError = '请填写留言内容';
      return false;
    }
    if (this.content.length > 2000) {
      this.formError = '留言内容不能超过 2000 字';
      return false;
    }
    this.formError = '';
    return true;
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.validate() || this.submitting) return;

    this.submitting = true;
    this.formSuccess = '';

    try {
      const res = await fetch(
        apiUrl(this.apiBase || DEFAULT_API_BASE, '/message'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname: this.nickname.trim(),
            contact: this.contact.trim() || undefined,
            content: this.content.trim(),
          }),
        },
      );

      if (!res.ok) {
        throw new Error('提交失败');
      }

      this.formSuccess = '留言提交成功，感谢你的反馈！';
      this.nickname = '';
      this.contact = '';
      this.content = '';

      this.dispatchEvent(
        new CustomEvent('message-success', {
          detail: { msg: '留言提交成功' },
          bubbles: true,
          composed: true,
        }),
      );
    } catch {
      this.formError = '提交失败，请稍后重试';
    } finally {
      this.submitting = false;
    }
  }

  render() {
    return html`
      <h1>联系我</h1>
      <div class="contacts">
        <p>邮箱：hello@example.com</p>
        <p>GitHub：<a href="https://github.com" target="_blank" rel="noopener noreferrer">@yourname</a></p>
      </div>

      <h2>留言</h2>
      <form @submit=${this.handleSubmit}>
        <label>
          昵称 *
          <input
            .value=${this.nickname}
            @input=${(e: Event) => {
              this.nickname = (e.target as HTMLInputElement).value;
            }}
            required
          />
        </label>
        <label>
          联系方式（选填）
          <input
            .value=${this.contact}
            @input=${(e: Event) => {
              this.contact = (e.target as HTMLInputElement).value;
            }}
          />
        </label>
        <label>
          留言内容 *
          <textarea
            rows="5"
            .value=${this.content}
            @input=${(e: Event) => {
              this.content = (e.target as HTMLTextAreaElement).value;
            }}
            required
          ></textarea>
        </label>
        ${this.formError
          ? html`<p class="error">${this.formError}</p>`
          : null}
        ${this.formSuccess
          ? html`<p class="success">${this.formSuccess}</p>`
          : null}
        <button type="submit" ?disabled=${this.submitting}>
          ${this.submitting ? '提交中...' : '提交留言'}
        </button>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-contact': WcContact;
  }
}
