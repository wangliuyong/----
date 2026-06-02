import { AppEmpty, AppError, PageTitle, SubApp } from '../../../../_shared/components';
import LinkCard from '../../components/LinkCard';
import { useLinks } from './useLinks';

/** 友链列表页 */
export default function LinksPage() {
  const { links, error } = useLinks();

  if (error) {
    return (
      <SubApp>
        <AppError message={error} />
      </SubApp>
    );
  }

  if (!links.length) {
    return (
      <SubApp>
        <AppEmpty>暂无友链</AppEmpty>
      </SubApp>
    );
  }

  return (
    <SubApp>
      <PageTitle className="mb-8">友情链接</PageTitle>
      <div className="space-y-4">
        {links.map((item) => (
          <LinkCard key={item.id} item={item} />
        ))}
      </div>
    </SubApp>
  );
}
