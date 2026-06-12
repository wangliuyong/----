import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { ReportDto } from '../collect/dto/collect.dto';

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
}
