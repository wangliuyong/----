import { Spin } from 'antd';
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';

const MDEditor = lazy(async () => {
  await import('@uiw/react-md-editor/markdown-editor.css');
  const mod = await import('@uiw/react-md-editor');
  return { default: mod.default };
});

interface ArticleMarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Markdown 富文本编辑器（基于 @uiw/react-md-editor）。
 * 作为 Form.Item 的直接子组件，确保 value / onChange 正确注入。
 * 高度通过 ResizeObserver 随容器自适应（MDEditor 需要数值型 px 高度）。
 */
export default function ArticleMarkdownEditor({
  value,
  onChange,
}: ArticleMarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState(480);

  /** 监听容器高度，向 MDEditor 传递 px 值（不支持百分比） */
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const syncHeight = () => {
      const next = node.clientHeight;
      if (next >= 240) {
        setEditorHeight(next);
      }
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /** 避免每次 render 创建新对象导致编辑器失焦 */
  const textareaProps = useMemo(
    () => ({
      placeholder: '在此撰写正文，支持 Markdown 语法…',
    }),
    [],
  );

  return (
    <div ref={containerRef} className="article-md-editor" data-color-mode="light">
      <Suspense
        fallback={
          <div className="article-md-editor__loading">
            <Spin tip="编辑器加载中…" />
          </div>
        }
      >
        <MDEditor
          value={value ?? ''}
          onChange={(next) => onChange?.(next ?? '')}
          height={editorHeight}
          preview="live"
          visibleDragbar={false}
          textareaProps={textareaProps}
        />
      </Suspense>
    </div>
  );
}
