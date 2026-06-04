import { AppSection, AppTag, SectionTitle } from '../../../../../_shared/components';

export interface AboutEducationSectionProps {
  education: string;
  certifications: string[];
}

/** 关于页：教育与认证 */
export default function AboutEducationSection({
  education,
  certifications,
}: AboutEducationSectionProps) {
  return (
    <AppSection className="mt-10 pb-4">
      <SectionTitle>教育背景</SectionTitle>
      <p className="text-muted">{education}</p>
      {certifications.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mt-6 mb-3">认证</h3>
          <ul className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <li key={cert}>
                <AppTag className="rounded-md">{cert}</AppTag>
              </li>
            ))}
          </ul>
        </>
      )}
    </AppSection>
  );
}
