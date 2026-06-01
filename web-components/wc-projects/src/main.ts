import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { apiUrl, DEFAULT_API_BASE, fetchJson } from '../../shared/api';
import { themeBaseCss } from '../../shared/theme-css';

interface Project {
  id: number;
  name: string;
  desc: string;
  techStack?: string;
  githubUrl?: string;
  previewUrl?: string;
}

/** 作品集列表 */
@customElement('wc-projects')
export class WcProjects extends LitElement {
  @property({ type: String }) theme = 'light';
  @property({ type: String, attribute: 'api-base' }) apiBase = DEFAULT_API_BASE;

  @state() private projects: Project[] = [];
  @state() private error = '';

  static styles = [
    unsafeCSS(themeBaseCss),
    css`
      .card-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
      .actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }
      .btn {
        padding: 0.35rem 0.75rem;
        border-radius: 6px;
        border: 1px solid #2563eb;
        text-decoration: none;
        font-size: 0.875rem;
      }
      :host([theme='dark']) .btn {
        border-color: #60a5fa;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    void this.load();
  }

  async load() {
    try {
      this.projects = await fetchJson<Project[]>(
        apiUrl(this.apiBase || DEFAULT_API_BASE, '/project/list'),
      );
      this.error = '';
    } catch {
      this.error = '项目列表加载失败';
    }
  }

  render() {
    if (this.error) {
      return html`<p class="error">${this.error}</p>`;
    }

    return html`
      <h1>作品集</h1>
      <div class="card-list">
        ${this.projects.map(
          (item) => html`
            <article class="card">
              <h2>${item.name}</h2>
              <p>${item.desc}</p>
              ${item.techStack
                ? html`<p class="muted">技术栈：${item.techStack}</p>`
                : null}
              <div class="actions">
                ${item.githubUrl
                  ? html`<a
                      class="btn"
                      href=${item.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      >GitHub 源码</a
                    >`
                  : null}
                ${item.previewUrl
                  ? html`<a
                      class="btn"
                      href=${item.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      >在线预览</a
                    >`
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
    'wc-projects': WcProjects;
  }
}
