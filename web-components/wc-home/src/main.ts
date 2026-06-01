import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { apiUrl, DEFAULT_API_BASE, fetchJson } from '../../shared/api';
import { themeBaseCss } from '../../shared/theme-css';

interface Article {
  id: number;
  title: string;
  summary?: string;
}

interface Project {
  id: number;
  name: string;
  desc: string;
  techStack?: string;
}

/** 首页：个人简介 + 精选博客/项目 */
@customElement('wc-home')
export class WcHome extends LitElement {
  @property({ type: String }) theme = 'light';
  @property({ type: String, attribute: 'api-base' }) apiBase = DEFAULT_API_BASE;

  @state() private articles: Article[] = [];
  @state() private projects: Project[] = [];
  @state() private error = '';

  static styles = [
    unsafeCSS(themeBaseCss),
    css`
      .intro {
        text-align: center;
        margin-bottom: 3rem;
      }
      .card-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
      }
      section + section {
        margin-top: 2.5rem;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    void this.loadData();
  }

  async loadData() {
    this.error = '';
    try {
      const base = this.apiBase || DEFAULT_API_BASE;
      const [articles, projects] = await Promise.all([
        fetchJson<Article[]>(apiUrl(base, '/article/list')),
        fetchJson<Project[]>(apiUrl(base, '/project/list')),
      ]);
      this.articles = articles;
      this.projects = projects;
    } catch {
      this.error = '内容加载失败，请确认后端已启动（端口 3001）';
    }
  }

  render() {
    if (this.error) {
      return html`<p class="error">${this.error}</p>`;
    }

    return html`
      <div class="intro">
        <h1>Hi，我是一名全栈开发者</h1>
        <p class="muted">
          技术栈：Next.js + NestJS + Web Components | 分享技术与项目
        </p>
      </div>

      <section>
        <h2>精选博客</h2>
        <div class="card-list">
          ${this.articles.slice(0, 3).map(
            (item) => html`
              <article class="card">
                <h3>${item.title}</h3>
                <p class="muted">${item.summary || '暂无摘要'}</p>
              </article>
            `,
          )}
        </div>
      </section>

      <section>
        <h2>精选项目</h2>
        <div class="card-list">
          ${this.projects.slice(0, 3).map(
            (item) => html`
              <article class="card">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                ${item.techStack
                  ? html`<p class="muted">技术栈：${item.techStack}</p>`
                  : null}
              </article>
            `,
          )}
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-home': WcHome;
  }
}
