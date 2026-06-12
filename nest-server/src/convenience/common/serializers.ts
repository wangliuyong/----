import type {
  ConvAiMessage,
  ConvAiSession,
  ConvBanner,
  ConvCategory,
  ConvCityInfo,
  ConvCollect,
  ConvNotice,
  ConvUser,
} from '@prisma/client';

/** ISO 8601 时间字符串 */
function toIso(date: Date): string {
  return date.toISOString();
}

/** 解析 images JSON 字段 */
export function parseImages(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/** ConvUser → UserProfile */
export function serializeUser(user: ConvUser) {
  return {
    id: user.id,
    openId: user.openId ?? undefined,
    phone: user.phone ?? undefined,
    nickname: user.nickname,
    avatar: user.avatar ?? undefined,
    userType: user.userType as 'USER' | 'MERCHANT' | 'ADMIN',
    status: user.status as 'ACTIVE' | 'DISABLED',
    realName: user.realName ?? undefined,
    createdAt: toIso(user.createdAt),
  };
}

/** 带子节点的分类类型 */
type CategoryWithChildren = ConvCategory & { children?: CategoryWithChildren[] };

/** ConvCategory → CategoryItem */
export function serializeCategory(item: CategoryWithChildren): {
  id: number;
  parentId: number | null;
  name: string;
  sort: number;
  enabled: boolean;
  children?: ReturnType<typeof serializeCategory>[];
} {
  return {
    id: item.id,
    parentId: item.parentId,
    name: item.name,
    sort: item.sort,
    enabled: item.enabled,
    ...(item.children
      ? {
          children: item.children
            .filter((c) => c.enabled)
            .sort((a, b) => a.sort - b.sort)
            .map((c) => serializeCategory(c)),
        }
      : {}),
  };
}

/** ConvBanner → BannerItem */
export function serializeBanner(item: ConvBanner) {
  return {
    id: item.id,
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl ?? undefined,
    sort: item.sort,
    online: item.online,
  };
}

/** ConvNotice → NoticeItem */
export function serializeNotice(item: ConvNotice) {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    published: item.published,
    createdAt: toIso(item.createdAt),
  };
}

type CityInfoWithCategory = ConvCityInfo & {
  category?: ConvCategory | null;
};

/** ConvCityInfo → CityInfoItem */
export function serializeCityInfo(
  item: CityInfoWithCategory,
  options?: { collected?: boolean },
) {
  return {
    id: item.id,
    userId: item.userId,
    categoryId: item.categoryId,
    categoryName: item.category?.name,
    title: item.title,
    content: item.content,
    price: item.price ?? undefined,
    address: item.address ?? undefined,
    latitude: item.latitude ?? undefined,
    longitude: item.longitude ?? undefined,
    images: parseImages(item.images),
    auditStatus: item.auditStatus as 'PENDING' | 'APPROVED' | 'REJECTED',
    viewCount: item.viewCount,
    collectCount: item.collectCount,
    createdAt: toIso(item.createdAt),
    ...(options?.collected !== undefined ? { collected: options.collected } : {}),
  };
}

/** ConvCollect → CollectItem */
export function serializeCollect(
  item: ConvCollect & { info?: CityInfoWithCategory | null },
) {
  return {
    id: item.id,
    userId: item.userId,
    infoId: item.infoId,
    createdAt: toIso(item.createdAt),
    ...(item.info ? { info: serializeCityInfo(item.info) } : {}),
  };
}

/** ConvAiSession → AiSessionItem */
export function serializeAiSession(item: ConvAiSession) {
  return {
    id: item.id,
    userId: item.userId,
    title: item.title,
    createdAt: toIso(item.createdAt),
  };
}

/** ConvAiMessage → AiMessageItem */
export function serializeAiMessage(item: ConvAiMessage) {
  return {
    id: item.id,
    sessionId: item.sessionId,
    role: item.role as 'user' | 'assistant',
    content: item.content,
    createdAt: toIso(item.createdAt),
  };
}

/** 分页结果 */
export function pageResult<T>(list: T[], total: number, page: number, pageSize: number) {
  return { list, total, page, pageSize };
}
