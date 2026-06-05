import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { useMemo } from 'react';

interface ArticleMarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Markdown 富文本编辑器（基于 @uiw/react-md-editor）。
 * 支持工具栏、实时预览，与 Ant Design Form 受控模式兼容。
 * 高度随视口自适应，保证编辑区有足够可视空间。
 */
export default function ArticleMarkdownEditor({
  value,
  onChange,
}: ArticleMarkdownEditorProps) {
  /** 避免每次 render 创建新对象导致编辑器失焦 */
  const textareaProps = useMemo(
    () => ({
      placeholder: '在此撰写正文，支持 Markdown 语法…',
    }),
    [],
  );

  return (
    <div className="article-md-editor" data-color-mode="light">
      <MDEditor
        value={value ?? ''}
        onChange={(next) => onChange?.(next ?? '')}
        height="100%"
        preview="live"
        visibleDragbar={false}
        textareaProps={textareaProps}
      />
    </div>
  );
}
