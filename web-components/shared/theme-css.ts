/** 各子组件共用的明暗主题 CSS 字符串（避免 shared 目录依赖 lit） */
export const themeBaseCss = `
  :host {
    display: block;
    width: 100%;
    color: #1f2937;
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
  }

  :host([theme='dark']) {
    color: #f3f4f6;
  }

  h1, h2, h3 {
    margin: 0 0 0.75rem;
    font-weight: 700;
  }

  a {
    color: #2563eb;
  }

  :host([theme='dark']) a {
    color: #60a5fa;
  }

  .card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    background: #fff;
  }

  :host([theme='dark']) .card {
    border-color: #374151;
    background: #1f2937;
  }

  .muted {
    color: #6b7280;
    font-size: 0.875rem;
  }

  :host([theme='dark']) .muted {
    color: #9ca3af;
  }

  .error {
    color: #dc2626;
    padding: 1rem;
    text-align: center;
  }
`;
