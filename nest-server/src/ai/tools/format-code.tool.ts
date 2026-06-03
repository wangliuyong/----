import { tool } from 'langchain';
import * as z from 'zod';

/**
 * 代码格式化展示工具：返回结构化代码块，供前端 Prism 高亮渲染。
 */
export function createFormatCodeTool() {
  return tool(
    async ({ code, language }) => {
      const trimmed = code.trim();
      return JSON.stringify({
        type: 'code',
        language: language || 'text',
        code: trimmed,
      });
    },
    {
      name: 'format_code',
      description:
        '格式化并展示代码块。当用户要求展示代码、格式化代码、解释代码片段时使用。',
      schema: z.object({
        code: z.string().describe('要展示的源代码'),
        language: z
          .string()
          .optional()
          .describe('编程语言，如 typescript、javascript、python、bash 等'),
      }),
    },
  );
}
