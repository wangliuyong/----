import { LitElement, html, css, nothing, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import { apiUrl, DEFAULT_API_BASE, fetchJson } from '../../shared/api';
import { themeBaseCss } from '../../shared/theme-css';

interface Article {
  id: number;
  title: string;
  summary?: string;
  content: string;
  category?: string;
  tags?: string;
  slug?: string;
  publishedAt: string;
}

/** 博客：列表 / 详情 / 筛选 */
@customElement('wc-blog')
export class WcBlog extends LitElement {
  @property({ type: String }) theme = 'light';
  @property({ type: String, attribute: 'api-base' }) apiBase = DEFAULT_API_BASE;
  /** detail 时由 Next 传入文章 id */
  @property({ type: String, attribute: 'article-id' }) articleId = '';
  @property({ type: String }) mode: 'list' | 'detail' = 'list';

  @state() private articles: Article[] = [];
  @state() private detail: Article | null = null;
  @state() private filterCategory = '';
  @state() private filterTag = '';
  @state() private error = '';
  @state() private loading = true;

  static styles = [
    unsafeCSS(themeBaseCss),
    css`
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      select,
      button {
        padding: 0.4rem 0.75rem;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background: #fff;
        cursor: pointer;
      }
      :host([theme='dark']) select,
      :host([theme='dark']) button {
        background: #374151;
        border-color: #4b5563;
        color: #f3f4f6;
      }
      .list-item {
        margin-bottom: 1rem;
      }
      .article-body :is(pre, code) {
        font-family: ui-monospace, monospace;
      }
      .article-body pre {
        background: #111827;
        color: #f9fafb;
        padding: 1rem;
        border-radius: 8px;
        overflow-x: auto;
      }
      .back {
        margin-bottom: 1rem;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    void this.load();
  }

  updated(changed: Map<string, unknown>) {
    if (
      changed.has('articleId') ||
      changed.has('mode') ||
      changed.has('apiBase')
    ) {
      void this.load();
    }
  }

  async load() {
    this.loading = true;
    this.error = '';
    const base = this.apiBase || DEFAULT_API_BASE;

    try {
      if (this.mode === 'detail' && this.articleId) {
        this.detail = await fetchJson<Article>(
          apiUrl(base, `/article/${this.articleId}`),
        );
        this.articles = [];
      } else {
        const params = new URLSearchParams();
        if (this.filterCategory) params.set('category', this.filterCategory);
        if (this.filterTag) params.set('tag', this.filterTag);
        const qs = params.toString() ? `?${params}` : '';
        this.articles = await fetchJson<Article[]>(
          apiUrl(base, `/article/list${qs}`),
        );
        this.detail = null;
      }
    } catch {
      this.error = '博客加载失败';
    } finally {
      this.loading = false;
    }
  }

  private renderMarkdown(content: string) {
    const htmlStr = marked.parse(content, { async: false }) as string;
    const wrap = document.createElement('div');
    wrap.innerHTML = htmlStr;
    wrap.querySelectorAll('pre code').forEach((block) => {
      Prism.highlightElement(block as HTMLElement);
    });
    return wrap.innerHTML;
  }

  private get categories() {
    return [...new Set(this.articles.map((a) => a.category).filter(Boolean))];
  }

  render() {
    if (this.loading) {
      return html`<p class="muted">加载中...</p>`;
    }
    if (this.error) {
      return html`<p class="error">${this.error}</p>`;
    }

    if (this.mode === 'detail' && this.detail) {
      return html`
        <a class="back" href="/blog">← 返回列表</a>
        <article>
          <h1>${this.detail.title}</h1>
          <p class="muted">
            ${new Date(this.detail.publishedAt).toLocaleDateString('zh-CN')}
            ${this.detail.category ? ` · ${this.detail.category}` : nothing}
          </p>
          <div
            class="article-body"
            .innerHTML=${this.renderMarkdown(this.detail.content)}
          ></div>
        </article>
      `;
    }

    return html`
      <h1>博客</h1>
      <div class="toolbar">
        <select
          @change=${(e: Event) => {
            this.filterCategory = (e.target as HTMLSelectElement).value;
            void this.load();
          }}
        >
          <option value="">全部分类</option>
          ${this.categories.map(
            (c) => html`<option value=${c}>${c}</option>`,
          )}
        </select>
        <input
          placeholder="按标签筛选"
          .value=${this.filterTag}
          @change=${(e: Event) => {
            this.filterTag = (e.target as HTMLInputElement).value;
            void this.load();
          }}
        />
        <button type="button" @click=${() => void this.load()}>筛选</button>
      </div>

      ${this.articles.map(
        (item) => html`
          <div class="card list-item">
            <h2>
              <a href="/blog/${item.id}">${item.title}</a>
            </h2>
            <p class="muted">${item.summary || ''}</p>
            <p class="muted">
              ${new Date(item.publishedAt).toLocaleDateString('zh-CN')}
            </p>
          </div>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-blog': WcBlog;
  }
}
