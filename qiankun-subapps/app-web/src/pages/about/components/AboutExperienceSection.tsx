import { AppSection, SectionTitle } from '../../../../../_shared/components';

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  summary: string;
}

export interface AboutExperienceSectionProps {
  experiences: ExperienceItem[];
}

/** 关于页：工作履历时间线 */
export default function AboutExperienceSection({ experiences }: AboutExperienceSectionProps) {
  return (
    <AppSection className="mt-10">
      <SectionTitle>工作履历</SectionTitle>
      <div className="app-timeline pl-6 space-y-8">
        {experiences.map((item) => (
          <div key={`${item.company}-${item.period}`}>
            <p className="text-sm text-faint">{item.period}</p>
            <h3 className="font-semibold mt-1">
              {item.role} · {item.company}
            </h3>
            <p className="mt-2 text-muted text-sm leading-relaxed">{item.summary}</p>
          </div>
        ))}
      </div>
    </AppSection>
  );
}
