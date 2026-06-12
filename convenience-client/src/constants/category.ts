/**
 * 一级分类 UI 映射（图标 / 副文案）
 * 与后端分类树一级节点 id 对应
 */
export const CATEGORY_ROOT_ICON: Record<number, string> = {
  1: 'bag',
  2: 'account',
  3: 'home',
  4: 'map-fill',
  5: 'car',
  6: 'tags',
  7: 'gift-fill',
  8: 'camera-fill',
  9: 'heart-fill',
  10: 'shopping-cart-fill',
  11: 'setting-fill',
  12: 'file-text-fill',
  13: 'star-fill',
  14: 'woman',
};

export const CATEGORY_ROOT_HINT: Record<number, string> = {
  1: '闲置好物',
  2: '靠谱岗位',
  3: '上门省心',
  4: '找房租房',
  5: '出行有车',
  6: '邻里生活',
  7: '吃喝拼单',
  8: '记录美好',
  9: '健康关怀',
  10: '生意转让',
  11: '一站式装',
  12: '专业咨询',
  13: '变美丽',
  14: '育儿安心',
};

/** 获取一级分类图标，缺省回退 grid */
export function getCategoryRootIcon(id: number): string {
  return CATEGORY_ROOT_ICON[id] || 'grid';
}

/** 获取一级分类副文案 */
export function getCategoryRootHint(id: number): string {
  return CATEGORY_ROOT_HINT[id] || '去看看';
}
