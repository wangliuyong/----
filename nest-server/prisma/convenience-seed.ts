import type { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  BANNER_SEED,
  CITY_INFO_SEED,
  CONV_USER_SEED,
  NOTICE_SEED,
} from './convenience-seed-data';

/** 分类种子 */
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

/** 清理历史 mock 静态图路径（客户端已移除 static/mock） */
async function cleanupLegacyMockMedia(prisma: PrismaClient) {
  await prisma.convBanner.updateMany({
    where: { imageUrl: { startsWith: '/static/mock/' } },
    data: { imageUrl: '', online: false },
  });
  await prisma.convUser.updateMany({
    where: { avatar: { startsWith: '/static/mock/' } },
    data: { avatar: '' },
  });
  const infos = await prisma.convCityInfo.findMany({
    select: { id: true, images: true },
  });
  for (const info of infos) {
    try {
      const list = JSON.parse(info.images || '[]') as string[];
      if (!Array.isArray(list) || !list.some((url) => url.includes('/static/mock/'))) continue;
      await prisma.convCityInfo.update({
        where: { id: info.id },
        data: { images: JSON.stringify([]) },
      });
    } catch {
      // 忽略非法 JSON
    }
  }
}

/** 写入/补全便民业务演示数据（按标题去重，已有数据不覆盖） */
export async function seedConvenience(prisma: PrismaClient) {
  await cleanupLegacyMockMedia(prisma);
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


  /** 轮播图：按 imageUrl 增量补全 */
  for (const banner of BANNER_SEED) {
    const exists = await prisma.convBanner.findFirst({
      where: { imageUrl: banner.imageUrl },
    });
    if (!exists) {
      await prisma.convBanner.create({ data: { ...banner } });
    }
  }

  /** 公告：按标题增量补全 */
  for (const notice of NOTICE_SEED) {
    const exists = await prisma.convNotice.findFirst({
      where: { title: notice.title },
    });
    if (!exists) {
      await prisma.convNotice.create({ data: { ...notice } });
    }
  }

  /** 演示用户（密码 123456） */
  const passwordHash = await bcrypt.hash('123456', 10);
  const userByPhone = new Map<string, { id: number }>();
  for (const u of CONV_USER_SEED) {
    const row = await prisma.convUser.upsert({
      where: { phone: u.phone },
      update: { password: passwordHash, nickname: u.nickname, avatar: u.avatar },
      create: {
        phone: u.phone,
        password: passwordHash,
        nickname: u.nickname,
        avatar: u.avatar,
        openId: u.openId,
        userType: 'USER',
        status: 'ACTIVE',
      },
    });
    userByPhone.set(u.phone, { id: row.id });
  }

  /** 便民信息：按标题增量补全（约 30+ 条） */
  const createdInfoIds: number[] = [];
  for (const item of CITY_INFO_SEED) {
    const exists = await prisma.convCityInfo.findFirst({
      where: { title: item.title },
    });
    if (exists) {
      createdInfoIds.push(exists.id);
      continue;
    }

    const user = userByPhone.get(item.userPhone);
    if (!user) continue;

    const row = await prisma.convCityInfo.create({
      data: {
        userId: user.id,
        categoryId: item.categoryId,
        title: item.title,
        content: item.content,
        price: item.price,
        address: item.address,
        latitude: item.latitude,
        longitude: item.longitude,
        images: JSON.stringify(item.images),
        auditStatus: item.auditStatus,
        viewCount: item.viewCount,
        collectCount: item.collectCount,
        createdAt: item.createdAt,
      },
    });
    createdInfoIds.push(row.id);
  }

  /** 主账号收藏若干已通过的信息 */
  const mainUser = userByPhone.get('13800138000');
  if (mainUser) {
    const toCollect = await prisma.convCityInfo.findMany({
      where: { auditStatus: 'APPROVED' },
      orderBy: { viewCount: 'desc' },
      take: 5,
    });
    for (const info of toCollect) {
      await prisma.convCollect.upsert({
        where: { userId_infoId: { userId: mainUser.id, infoId: info.id } },
        update: {},
        create: { userId: mainUser.id, infoId: info.id },
      });
    }
  }

  /** AI 会话演示（无主会话时创建） */
  if (mainUser) {
    const sessionCount = await prisma.convAiSession.count({
      where: { userId: mainUser.id },
    });
    if (sessionCount === 0) {
      const session = await prisma.convAiSession.create({
        data: { userId: mainUser.id, title: '如何发布信息？' },
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

      const session2 = await prisma.convAiSession.create({
        data: { userId: mainUser.id, title: '附近有什么二手手机？' },
      });
      await prisma.convAiMessage.createMany({
        data: [
          {
            sessionId: session2.id,
            role: 'user',
            content: '附近有什么二手手机？',
            createdAt: new Date('2026-06-11T08:00:00.000Z'),
          },
          {
            sessionId: session2.id,
            role: 'assistant',
            content:
              '可以在首页「最新推荐」或分类「二手交易 → 数码家电」中查看，也支持按距离排序浏览。',
            createdAt: new Date('2026-06-11T08:00:06.000Z'),
          },
        ],
      });
    }
  }

  /** 举报演示（无举报记录时创建 1 条） */
  const reportCount = await prisma.convReport.count();
  if (reportCount === 0 && mainUser) {
    const target = await prisma.convCityInfo.findFirst({
      where: { auditStatus: 'APPROVED', title: { not: { contains: '待审核' } } },
    });
    if (target) {
      await prisma.convReport.create({
        data: {
          userId: mainUser.id,
          infoId: target.id,
          reportType: 'SPAM',
          content: '演示举报：疑似重复发布',
        },
      });
    }
  }
}
