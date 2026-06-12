import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConvAdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /** 便民业务概览统计 */
  async getOverview() {
    const [
      pendingAuditCount,
      approvedInfoCount,
      rejectedInfoCount,
      userCount,
      reportCount,
      noticeCount,
      bannerCount,
    ] = await Promise.all([
      this.prisma.convCityInfo.count({ where: { auditStatus: 'PENDING' } }),
      this.prisma.convCityInfo.count({ where: { auditStatus: 'APPROVED' } }),
      this.prisma.convCityInfo.count({ where: { auditStatus: 'REJECTED' } }),
      this.prisma.convUser.count(),
      this.prisma.convReport.count(),
      this.prisma.convNotice.count(),
      this.prisma.convBanner.count({ where: { online: true } }),
    ]);

    return {
      pendingAuditCount,
      approvedInfoCount,
      rejectedInfoCount,
      userCount,
      reportCount,
      noticeCount,
      bannerCount,
    };
  }
}
