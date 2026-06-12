import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { pageResult } from '../common/serializers';
import type { ReportDto } from '../collect/dto/collect.dto';
import type { AdminReportQueryDto } from '../admin/dto/conv-admin.dto';

@Injectable()
export class ConvReportService {
  constructor(private readonly prisma: PrismaService) {}

  /** 提交举报 */
  async create(userId: number, dto: ReportDto) {
    const info = await this.prisma.convCityInfo.findUnique({
      where: { id: dto.infoId },
    });
    if (!info) {
      throw new NotFoundException('信息不存在');
    }

    const report = await this.prisma.convReport.create({
      data: {
        userId,
        infoId: dto.infoId,
        reportType: dto.reportType,
        content: dto.content,
      },
    });
    return { id: report.id };
  }

  /** 管理端：举报列表 */
  async findAdminList(query: AdminReportQueryDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const where = query.reportType ? { reportType: query.reportType } : {};

    const [total, rows] = await Promise.all([
      this.prisma.convReport.count({ where }),
      this.prisma.convReport.findMany({
        where,
        include: {
          user: { select: { id: true, nickname: true } },
          info: { select: { id: true, title: true, auditStatus: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const list = rows.map((item) => ({
      id: item.id,
      userId: item.userId,
      userNickname: item.user.nickname,
      infoId: item.infoId,
      infoTitle: item.info.title,
      infoAuditStatus: item.info.auditStatus,
      reportType: item.reportType,
      content: item.content,
      createdAt: item.createdAt.toISOString(),
    }));

    return pageResult(list, total, page, pageSize);
  }

  /** 管理端：删除举报记录 */
  async removeAdmin(id: number) {
    const item = await this.prisma.convReport.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('举报记录不存在');
    }
    await this.prisma.convReport.delete({ where: { id } });
    return null;
  }
}
