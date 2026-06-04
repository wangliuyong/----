import { AppMark, AppSection, SectionTitle } from '../../../../../_shared/components';

export interface AboutStrengthsSectionProps {
  strengths: string[];
}

/** 关于页：核心优势列表 */
export default function AboutStrengthsSection({ strengths }: AboutStrengthsSectionProps) {
  return (
    <AppSection className="mt-10">
      <SectionTitle>核心优势</SectionTitle>
      <ul className="space-y-2 app-stagger-sm">
        {strengths.map((item) => (
          <li key={item} className="flex gap-2 text-muted text-sm leading-relaxed">
            <AppMark />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </AppSection>
  );
}
