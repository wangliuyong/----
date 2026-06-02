import { useEffect, useState } from 'react';
import { apiUrl, fetchJson } from '../../../_shared/api';
import {
  AppButtonGhost,
  AppCard,
  AppError,
  PageTitle,
  SubApp,
} from '../../../_shared/components';

interface Project {
  id: number;
  name: string;
  desc: string;
  techStack?: string;
  githubUrl?: string;
  previewUrl?: string;
}

/** 作品集列表与外链（原 app-projects） */
export default function ProjectsPage({ apiBase }: { apiBase: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJson<Project[]>(apiUrl(apiBase, '/project/list'))
      .then(setProjects)
      .catch(() => setError('项目列表加载失败'));
  }, [apiBase]);

  if (error) {
    return (
      <SubApp>
        <AppError message={error} />
      </SubApp>
    );
  }

  return (
    <SubApp>
      <PageTitle className="mb-8">作品集</PageTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((item) => (
          <AppCard as="article" key={item.id} className="p-5">
            <h2 className="text-xl font-bold font-serif">{item.name}</h2>
            <p className="text-muted mt-2">{item.desc}</p>
            {item.techStack && (
              <p className="text-sm text-faint mt-2">技术栈：{item.techStack}</p>
            )}
            <div className="flex gap-4 mt-4">
              {item.githubUrl && (
                <AppButtonGhost
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  GitHub 源码
                </AppButtonGhost>
              )}
              {item.previewUrl && (
                <AppButtonGhost
                  href={item.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  在线预览
                </AppButtonGhost>
              )}
            </div>
          </AppCard>
        ))}
      </div>
    </SubApp>
  );
}
