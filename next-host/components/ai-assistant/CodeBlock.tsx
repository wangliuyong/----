interface CodeBlockProps {
  language: string;
  code: string;
}

/** 代码展示块 */
export function CodeBlock({ language, code }: CodeBlockProps) {
  return (
    <div className="ai-code">
      <div className="ai-code__bar">
        <span className="ai-code__lang">{language}</span>
      </div>
      <pre className="ai-code__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
