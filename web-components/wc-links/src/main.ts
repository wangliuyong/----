import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { apiUrl, DEFAULT_API_BASE, fetchJson } from '../../shared/api';
import { themeBaseCss } from '../../shared/theme-css';

interface FriendLink {
  id: number;
  name: string;
  url: string;
  description?: string;
  avatar?: string;
}

/** 友链列表 */
@customElement('wc-links')
export class WcLinks extends LitElement {
  @property({ type: String }) theme = 'light';
  @property({ type: String, attribute: 'api-base' }) apiBase = DEFAULT_API_BASE;

  @state() private links: FriendLink[] = [];
  @state() private error = '';

  static styles = [
    unsafeCSS(themeBaseCss),
    css`
      .link-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .link-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }
      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        object-fit: cover;
        background: #e5e7eb;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    void this.load();
  }

  async load() {
    try {
      this.links = await fetchJson<FriendLink[]>(
        apiUrl(this.apiBase || DEFAULT_API_BASE, '/link/list'),
      );
      this.error = '';
    } catch {
      this.error = '友链加载失败';
    }
  }

  render() {
    if (this.error) {
      return html`<p class="error">${this.error}</p>`;
    }

    if (!this.links.length) {
      return html`<p class="muted">暂无友链</p>`;
    }

    return html`
      <h1>友情链接</h1>
      <div class="link-list">
        ${this.links.map(
          (item) => html`
            <article class="card link-item">
              ${item.avatar
                ? html`<img class="avatar" src=${item.avatar} alt="" />`
                : html`<div class="avatar"></div>`}
              <div>
                <h2>
                  <a
                    href=${item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    >${item.name}</a
                  >
                </h2>
                ${item.description
                  ? html`<p class="muted">${item.description}</p>`
                  : null}
              </div>
            </article>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-links': WcLinks;
  }
}
