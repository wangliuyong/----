import { Document } from '@langchain/core/documents';
import type { Project } from '@prisma/client';

/** 将项目记录转为 LangChain Document */
export function loadProjects(projects: Project[]): Document[] {
  return projects.map((p) => {
    const parts = [
      `项目名称：${p.name}`,
      `描述：${p.desc}`,
      p.techStack ? `技术栈：${p.techStack}` : '',
      p.githubUrl ? `GitHub：${p.githubUrl}` : '',
      p.previewUrl ? `预览：${p.previewUrl}` : '',
    ].filter(Boolean);

    return new Document({
      pageContent: parts.join('\n'),
      metadata: {
        source: 'projects',
        sourceId: String(p.id),
        title: p.name,
      },
    });
  });
}
