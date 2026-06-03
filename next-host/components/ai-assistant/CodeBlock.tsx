interface CodeBlockProps {
  language: string;
  code: string;
}

/** 代码展示块 */
export function CodeBlock({ language, code }: CodeBlockProps) {
  return (
    <div className="dog-ai-code">
      <div className="dog-ai-code__bar">
        <span className="dog-ai-code__lang">{language}</span>
      </div>
      <pre className="dog-ai-code__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
