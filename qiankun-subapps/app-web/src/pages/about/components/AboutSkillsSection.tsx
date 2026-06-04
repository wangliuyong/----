import { AppSection, AppTag, SectionTitle } from '../../../../../_shared/components';

export interface SkillGroup {
  title: string;
  description: string;
  items: string[];
}

export interface AboutSkillsSectionProps {
  skillGroups: SkillGroup[];
}

/** 关于页：技能分组 */
export default function AboutSkillsSection({ skillGroups }: AboutSkillsSectionProps) {
  return (
    <AppSection className="mt-10">
      <SectionTitle>技能</SectionTitle>
      <div className="space-y-6 app-stagger-sm">
        {skillGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-semibold">{group.title}</h3>
            <p className="text-sm text-faint mt-0.5">{group.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {group.items.map((skill) => (
                <AppTag key={skill}>{skill}</AppTag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppSection>
  );
}
