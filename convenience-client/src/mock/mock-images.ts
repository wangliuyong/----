/**
 * Mock 信息配图：按标题关键词与子分类匹配语义化图片
 * 图片已下载至 src/static/mock/topics/，走本地 static，不依赖外网 CDN
 */

const TOPIC_BASE = '/static/mock/topics';

/** 本地兜底图（主题文件缺失时使用） */
const FALLBACK_IMG = '/static/mock/1.jpg';

/** 全部主题 key（与 topics 目录下文件名一致） */
export const MOCK_TOPIC_KEYS = [
  'phone', 'laptop', 'headphones', 'air-purifier', 'furniture-table', 'bed', 'stroller', 'bag',
  'gaming', 'chair', 'car', 'carpool', 'cat', 'keys-lost', 'books', 'warehouse', 'coffee', 'food',
  'wedding', 'hospital', 'wheelchair', 'shop', 'ebike', 'supermarket', 'plumbing-work',
  'kitchen-cabinet', 'legal', 'document', 'nail', 'beauty-device', 'baby-care', 'storefront',
  'job-event', 'tutoring', 'internship', 'photography', 'cleaning', 'renovation-clean',
  'air-conditioner', 'plumbing', 'moving', 'keys', 'apartment', 'bedroom', 'job-office',
  'general', 'sports', 'music', 'office-equipment', 'design', 'sales', 'pet-service',
  'appliance-clean', 'plants', 'parking', 'repair', 'driving', 'car-wash', 'event',
  'skill-exchange', 'bakery', 'groceries', 'dining', 'makeup', 'wedding-car', 'hotel',
  'therapy', 'health', 'tcm', 'medicine', 'equipment', 'franchise', 'materials', 'design-plan',
  'furniture-install', 'accounting', 'contract', 'business-reg', 'haircut', 'skincare',
  'early-education', 'maternity', 'parent-child',
] as const;

/** 获取主题图本地路径 */
export function mockTopicImg(topic: string): string {
  if ((MOCK_TOPIC_KEYS as readonly string[]).includes(topic)) {
    return `${TOPIC_BASE}/${topic}.jpg`;
  }
  return `${TOPIC_BASE}/general.jpg`;
}

/** 标题关键词 → 主题图（优先级从高到低） */
const TITLE_RULES: Array<{ pattern: RegExp; topic: string }> = [
  { pattern: /iphone|手机/i, topic: 'phone' },
  { pattern: /macbook|笔记本|电脑/i, topic: 'laptop' },
  { pattern: /耳机|降噪/i, topic: 'headphones' },
  { pattern: /净化器/i, topic: 'air-purifier' },
  { pattern: /餐桌|实木/i, topic: 'furniture-table' },
  { pattern: /床架|床/i, topic: 'bed' },
  { pattern: /推车|bugaboo|童车/i, topic: 'stroller' },
  { pattern: /coach|托特包|鞋包/i, topic: 'bag' },
  { pattern: /switch|steam|掌机|deck/i, topic: 'gaming' },
  { pattern: /工学椅|赫曼米勒/i, topic: 'chair' },
  { pattern: /卡罗拉|二手车|丰田/i, topic: 'car' },
  { pattern: /顺风车|拼车|早高峰/i, topic: 'carpool' },
  { pattern: /狸花猫|领养|宠物/i, topic: 'cat' },
  { pattern: /钥匙.*捡|捡到.*钥匙/i, topic: 'keys-lost' },
  { pattern: /考研|图书|资料/i, topic: 'books' },
  { pattern: /分拣|仓库/i, topic: 'warehouse' },
  { pattern: /咖啡|瑞幸/i, topic: 'coffee' },
  { pattern: /家常菜|馄饨|深夜食堂/i, topic: 'food' },
  { pattern: /婚礼|跟拍|婚纱/i, topic: 'wedding' },
  { pattern: /陪诊|医院/i, topic: 'hospital' },
  { pattern: /轮椅/i, topic: 'wheelchair' },
  { pattern: /便利店|转让/i, topic: 'shop' },
  { pattern: /九号|电动车|电动/i, topic: 'ebike' },
  { pattern: /山姆|拼团|拼单/i, topic: 'supermarket' },
  { pattern: /水电|改造/i, topic: 'plumbing-work' },
  { pattern: /全屋定制|欧松板/i, topic: 'kitchen-cabinet' },
  { pattern: /劳动纠纷|法律/i, topic: 'legal' },
  { pattern: /商标|知产/i, topic: 'document' },
  { pattern: /美甲|美睫/i, topic: 'nail' },
  { pattern: /雅萌|美容仪/i, topic: 'beauty-device' },
  { pattern: /月嫂|育儿嫂/i, topic: 'baby-care' },
  { pattern: /空铺|招租|商铺/i, topic: 'storefront' },
  { pattern: /促销|展会/i, topic: 'job-event' },
  { pattern: /家教|英语/i, topic: 'tutoring' },
  { pattern: /实习|新媒体/i, topic: 'internship' },
  { pattern: /摄影助理|跟拍/i, topic: 'photography' },
  { pattern: /保洁|家政/i, topic: 'cleaning' },
  { pattern: /开荒|新房/i, topic: 'renovation-clean' },
  { pattern: /空调|加氟/i, topic: 'air-conditioner' },
  { pattern: /水管|漏水/i, topic: 'plumbing' },
  { pattern: /搬家|货运/i, topic: 'moving' },
  { pattern: /开锁/i, topic: 'keys' },
  { pattern: /整租|两室|精装/i, topic: 'apartment' },
  { pattern: /合租|主卧/i, topic: 'bedroom' },
  { pattern: /前端|java|工程师|店长|运营|技术研发/i, topic: 'job-office' },
];

/** 子分类 ID → 默认主题图 */
const CATEGORY_TOPIC: Record<number, string> = {
  11: 'phone',
  12: 'furniture-table',
  13: 'stroller',
  14: 'bag',
  15: 'books',
  16: 'sports',
  17: 'music',
  18: 'office-equipment',
  19: 'gaming',
  21: 'job-office',
  22: 'job-event',
  23: 'internship',
  24: 'warehouse',
  25: 'design',
  26: 'sales',
  27: 'job-office',
  31: 'cleaning',
  32: 'repair',
  33: 'moving',
  34: 'keys',
  35: 'pet-service',
  36: 'plumbing',
  37: 'appliance-clean',
  38: 'plants',
  41: 'apartment',
  42: 'bedroom',
  43: 'apartment',
  44: 'parking',
  45: 'storefront',
  46: 'apartment',
  51: 'car',
  52: 'carpool',
  53: 'driving',
  54: 'car-wash',
  55: 'ebike',
  56: 'carpool',
  61: 'cat',
  62: 'tutoring',
  63: 'event',
  64: 'keys-lost',
  65: 'supermarket',
  66: 'skill-exchange',
  71: 'coffee',
  72: 'food',
  73: 'bakery',
  74: 'groceries',
  75: 'food',
  76: 'dining',
  81: 'wedding',
  82: 'wedding',
  83: 'photography',
  84: 'makeup',
  85: 'wedding-car',
  86: 'hotel',
  91: 'hospital',
  92: 'therapy',
  93: 'wheelchair',
  94: 'health',
  95: 'tcm',
  96: 'medicine',
  111: 'shop',
  112: 'storefront',
  113: 'equipment',
  114: 'franchise',
  115: 'storefront',
  122: 'plumbing-work',
  123: 'kitchen-cabinet',
  124: 'materials',
  125: 'design-plan',
  126: 'furniture-install',
  132: 'legal',
  133: 'accounting',
  134: 'contract',
  135: 'document',
  136: 'business-reg',
  143: 'nail',
  144: 'haircut',
  145: 'skincare',
  146: 'beauty-device',
  147: 'makeup',
  155: 'baby-care',
  156: 'stroller',
  157: 'early-education',
  158: 'maternity',
  159: 'parent-child',
};

/** 根据子分类与标题解析主题 key */
export function resolveMockTopic(categoryId: number, title: string): string {
  for (const rule of TITLE_RULES) {
    if (rule.pattern.test(title)) return rule.topic;
  }
  return CATEGORY_TOPIC[categoryId] || 'general';
}

/** 获取信息配图 */
export function mockInfoImages(categoryId: number, title: string): string[] {
  return [mockTopicImg(resolveMockTopic(categoryId, title))];
}

/** 轮播/头像等通用 mock 图（本地 static） */
export function mockImg(index: number): string {
  const n = ((index - 1) % 10) + 1;
  return `/static/mock/${n}.jpg`;
}

/** 轮播图专用语义化配图（本地 topics） */
export function mockBannerImg(index: number): string {
  const topics = ['general', 'apartment', 'job-office', 'cleaning', 'food'];
  return mockTopicImg(topics[(index - 1) % topics.length]);
}

/** 兜底占位图 */
export function mockFallbackImg(): string {
  return FALLBACK_IMG;
}
