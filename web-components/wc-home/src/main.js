var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { apiUrl, DEFAULT_API_BASE, fetchJson } from '../../shared/api';
import { themeBaseStyles } from '../../shared/theme-css';
/** 首页：个人简介 + 精选博客/项目 */
let WcHome = class WcHome extends LitElement {
    constructor() {
        super(...arguments);
        this.theme = 'light';
        this.apiBase = DEFAULT_API_BASE;
        this.articles = [];
        this.projects = [];
        this.error = '';
    }
    static { this.styles = [
        themeBaseStyles,
        css `
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
    ]; }
    connectedCallback() {
        super.connectedCallback();
        void this.loadData();
    }
    async loadData() {
        this.error = '';
        try {
            const base = this.apiBase || DEFAULT_API_BASE;
            const [articles, projects] = await Promise.all([
                fetchJson(apiUrl(base, '/article/list')),
                fetchJson(apiUrl(base, '/project/list')),
            ]);
            this.articles = articles;
            this.projects = projects;
        }
        catch {
            this.error = '内容加载失败，请确认后端已启动（端口 3001）';
        }
    }
    render() {
        if (this.error) {
            return html `<p class="error">${this.error}</p>`;
        }
        return html `
      <div class="intro">
        <h1>Hi，我是一名全栈开发者</h1>
        <p class="muted">
          技术栈：Next.js + NestJS + Web Components | 分享技术与项目
        </p>
      </div>

      <section>
        <h2>精选博客</h2>
        <div class="card-list">
          ${this.articles.slice(0, 3).map((item) => html `
              <article class="card">
                <h3>${item.title}</h3>
                <p class="muted">${item.summary || '暂无摘要'}</p>
              </article>
            `)}
        </div>
      </section>

      <section>
        <h2>精选项目</h2>
        <div class="card-list">
          ${this.projects.slice(0, 3).map((item) => html `
              <article class="card">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                ${item.techStack
            ? html `<p class="muted">技术栈：${item.techStack}</p>`
            : null}
              </article>
            `)}
        </div>
      </section>
    `;
    }
};
__decorate([
    property({ type: String })
], WcHome.prototype, "theme", void 0);
__decorate([
    property({ type: String, attribute: 'api-base' })
], WcHome.prototype, "apiBase", void 0);
__decorate([
    state()
], WcHome.prototype, "articles", void 0);
__decorate([
    state()
], WcHome.prototype, "projects", void 0);
__decorate([
    state()
], WcHome.prototype, "error", void 0);
WcHome = __decorate([
    customElement('wc-home')
], WcHome);
export { WcHome };
