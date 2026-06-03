import {
  AppButtonGhost,
  AppCard,
  AppError,
  PageTitle,
  SubApp,
} from '../../../../_shared/components';
import { useProjects } from './useProjects';

/** 作品集列表与外链（原 app-projects） */
export default function ProjectsPage() {
  const { projects, error } = useProjects();

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 app-stagger">
        {projects.map((item) => (
          <AppCard as="article" key={item.id} className="p-5">
            <h2 className="text-xl font-bold font-serif">{item.name}</h2>
            <p className="text-muted mt-2 line-clamp-2">{item.desc}</p>
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
