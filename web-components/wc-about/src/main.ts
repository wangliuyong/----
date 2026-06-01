import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { themeBaseCss } from '../../shared/theme-css';

/** 关于我：静态配置内容（MVP） */
@customElement('wc-about')
export class WcAbout extends LitElement {
  @property({ type: String }) theme = 'light';

  static styles = [
    unsafeCSS(themeBaseCss),
    css`
      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .tag {
        padding: 0.25rem 0.75rem;
        border-radius: 999px;
        background: #eff6ff;
        font-size: 0.875rem;
      }
      :host([theme='dark']) .tag {
        background: #1e3a5f;
      }
      .timeline {
        border-left: 2px solid #e5e7eb;
        margin-left: 0.5rem;
        padding-left: 1.25rem;
      }
      :host([theme='dark']) .timeline {
        border-color: #374151;
      }
      .timeline-item {
        margin-bottom: 1.5rem;
      }
    `,
  ];

  render() {
    return html`
      <section>
        <h1>关于我</h1>
        <p>
          全栈开发者，专注 Web 前端工程化与个人品牌建设。喜欢用 Next.js、NestJS
          与 Web Components 构建可独立迭代的轻量站点。
        </p>
      </section>

      <section style="margin-top: 2rem;">
        <h2>技能</h2>
        <div class="skills">
          ${['TypeScript', 'Next.js', 'Vue', 'NestJS', 'Lit', 'Prisma'].map(
            (s) => html`<span class="tag">${s}</span>`,
          )}
        </div>
      </section>

      <section style="margin-top: 2rem;">
        <h2>履历</h2>
        <div class="timeline">
          <div class="timeline-item">
            <h3>全栈工程师 · 某科技公司</h3>
            <p class="muted">2022 — 至今</p>
            <p>负责中后台与官网类产品，推动组件化与微前端落地。</p>
          </div>
          <div class="timeline-item">
            <h3>前端工程师 · 某互联网公司</h3>
            <p class="muted">2019 — 2022</p>
            <p>参与 C 端活动页与设计系统建设。</p>
          </div>
          <div class="timeline-item">
            <h3>计算机科学 · 某大学</h3>
            <p class="muted">2015 — 2019</p>
            <p>本科，主修软件工程与 Web 开发。</p>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-about': WcAbout;
  }
}
