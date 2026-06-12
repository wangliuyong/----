import type { PrismaClient } from '@prisma/client';

/** 分类种子（与 convenience-client mock 对齐） */
const CATEGORY_SEED: Array<{
  id: number;
  parentId: number | null;
  name: string;
  sort: number;
}> = [
  { id: 1, parentId: null, name: '二手交易', sort: 1 },
  { id: 11, parentId: 1, name: '数码家电', sort: 1 },
  { id: 12, parentId: 1, name: '家具家居', sort: 2 },
  { id: 13, parentId: 1, name: '母婴用品', sort: 3 },
  { id: 2, parentId: null, name: '求职招聘', sort: 2 },
  { id: 21, parentId: 2, name: '全职', sort: 1 },
  { id: 22, parentId: 2, name: '兼职', sort: 2 },
  { id: 23, parentId: 2, name: '实习', sort: 3 },
  { id: 3, parentId: null, name: '上门服务', sort: 3 },
  { id: 31, parentId: 3, name: '家政保洁', sort: 1 },
  { id: 32, parentId: 3, name: '维修安装', sort: 2 },
  { id: 33, parentId: 3, name: '搬家货运', sort: 3 },
  { id: 4, parentId: null, name: '房屋租售', sort: 4 },
  { id: 41, parentId: 4, name: '整租', sort: 1 },
  { id: 42, parentId: 4, name: '合租', sort: 2 },
  { id: 5, parentId: null, name: '车辆交通', sort: 5 },
  { id: 51, parentId: 5, name: '二手车', sort: 1 },
  { id: 52, parentId: 5, name: '顺风车', sort: 2 },
  { id: 6, parentId: null, name: '本地生活', sort: 6 },
  { id: 61, parentId: 6, name: '宠物领养', sort: 1 },
  { id: 62, parentId: 6, name: '教育培训', sort: 2 },
];

/** 写入便民业务演示数据（表为空时） */
export async function seedConvenience(prisma: PrismaClient) {
  const categoryCount = await prisma.convCategory.count();
  if (categoryCount === 0) {
    for (const cat of CATEGORY_SEED) {
      await prisma.convCategory.create({
        data: {
          id: cat.id,
          parentId: cat.parentId,
          name: cat.name,
          sort: cat.sort,
          enabled: true,
        },
      });
    }
  }

  const bannerCount = await prisma.convBanner.count();
  if (bannerCount === 0) {
    await prisma.convBanner.createMany({
      data: [
        { imageUrl: '/static/mock/1.jpg', linkUrl: '', sort: 1, online: true },
        { imageUrl: '/static/mock/2.jpg', linkUrl: '', sort: 2, online: true },
        { imageUrl: '/static/mock/3.jpg', linkUrl: '', sort: 3, online: true },
      ],
    });
  }

  /** 修正旧种子中不存在的 banner-x.jpg 路径 */
  const legacyBannerFix: Record<string, string> = {
    '/static/mock/banner-1.jpg': '/static/mock/1.jpg',
    '/static/mock/banner-2.jpg': '/static/mock/2.jpg',
    '/static/mock/banner-3.jpg': '/static/mock/3.jpg',
  };
  for (const [oldUrl, newUrl] of Object.entries(legacyBannerFix)) {
    await prisma.convBanner.updateMany({
      where: { imageUrl: oldUrl },
      data: { imageUrl: newUrl },
    });
  }

  const noticeCount = await prisma.convNotice.count();
  if (noticeCount === 0) {
    await prisma.convNotice.createMany({
      data: [
        {
          title: '同城便民平台上线公告',
          content:
            '欢迎使用同城便民小程序，发布信息请遵守社区规范，违规内容将被下架处理。',
          published: true,
          createdAt: new Date('2026-06-01T10:00:00.000Z'),
        },
        {
          title: '端午节服务安排',
          content: '节日期间部分上门服务商家营业时间调整，请提前预约。',
          published: true,
          createdAt: new Date('2026-06-08T09:00:00.000Z'),
        },
      ],
    });
  }

  const cityInfoCount = await prisma.convCityInfo.count();
  if (cityInfoCount === 0) {
    const user = await prisma.convUser.findFirst({ where: { phone: '13800138000' } });
    if (user) {
      await prisma.convCityInfo.createMany({
        data: [
          {
            userId: user.id,
            categoryId: 11,
            title: '九成新 iPhone 14 128G',
            content: '自用机，无拆修，电池健康 91%，配件齐全含原盒，浦东新区陆家嘴附近面交。',
            price: 3999,
            address: '浦东新区世纪大道',
            latitude: 31.235,
            longitude: 121.48,
            images: JSON.stringify(['/static/mock/2.jpg']),
            auditStatus: 'APPROVED',
            viewCount: 328,
            collectCount: 24,
            createdAt: new Date('2026-06-10T08:30:00.000Z'),
          },
          {
            userId: user.id,
            categoryId: 21,
            title: '电商运营全职 6K-10K',
            content: '负责店铺日常运营，有淘宝/拼多多经验优先，五险一金，双休。',
            price: 8000,
            address: '静安区南京西路',
            latitude: 31.23,
            longitude: 121.45,
            images: JSON.stringify(['/static/mock/3.jpg']),
            auditStatus: 'APPROVED',
            viewCount: 156,
            collectCount: 12,
            createdAt: new Date('2026-06-09T14:00:00.000Z'),
          },
          {
            userId: user.id,
            categoryId: 31,
            title: '深度保洁 3小时起',
            content: '专业团队上门，厨房油污、卫生间除垢、全屋除尘，工具自带。',
            price: 45,
            address: '闵行区莘庄',
            latitude: 31.112,
            longitude: 121.385,
            images: JSON.stringify(['/static/mock/5.jpg']),
            auditStatus: 'APPROVED',
            viewCount: 89,
            collectCount: 8,
            createdAt: new Date('2026-06-08T10:00:00.000Z'),
          },
          {
            userId: user.id,
            categoryId: 41,
            title: '两室一厅整租 近地铁',
            content: '精装修，家电齐全，押一付三，随时看房，限长租。',
            price: 5200,
            address: '浦东新区张江',
            latitude: 31.204,
            longitude: 121.589,
            images: JSON.stringify(['/static/mock/6.jpg']),
            auditStatus: 'APPROVED',
            viewCount: 412,
            collectCount: 35,
            createdAt: new Date('2026-06-07T16:30:00.000Z'),
          },
          {
            userId: user.id,
            categoryId: 11,
            title: '待审核：测试发布信息',
            content: '这是一条待审核的测试信息。',
            price: 100,
            images: JSON.stringify([]),
            auditStatus: 'PENDING',
            viewCount: 0,
            collectCount: 0,
            createdAt: new Date('2026-06-11T09:00:00.000Z'),
          },
        ],
      });

      const approved = await prisma.convCityInfo.findFirst({
        where: { userId: user.id, auditStatus: 'APPROVED' },
      });
      if (approved) {
        await prisma.convCollect.create({
          data: { userId: user.id, infoId: approved.id },
        });
      }

      const session = await prisma.convAiSession.create({
        data: { userId: user.id, title: '如何发布信息？' },
      });
      await prisma.convAiMessage.createMany({
        data: [
          {
            sessionId: session.id,
            role: 'user',
            content: '如何发布信息？',
            createdAt: new Date('2026-06-10T10:00:00.000Z'),
          },
          {
            sessionId: session.id,
            role: 'assistant',
            content:
              '【便民知识库】发布流程：底部 Tab「发布」→ 选择分类 → 填写标题与内容 → 上传图片 → 提交审核。',
            createdAt: new Date('2026-06-10T10:00:05.000Z'),
          },
        ],
      });
    }
  }
}
