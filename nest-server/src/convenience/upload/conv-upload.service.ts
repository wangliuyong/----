import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ConvUploadService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 将图片二进制写入数据库
   * @returns 图片记录 ID，用于生成访问 URL
   */
  async saveImage(userId: number, buffer: Buffer, mimeType: string) {
    return this.prisma.convImage.create({
      data: {
        userId,
        mimeType,
        data: new Uint8Array(buffer),
        size: buffer.length,
      },
    });
  }

  /** 读取图片（供 GET 接口输出） */
  async findImage(id: number) {
    const image = await this.prisma.convImage.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException('图片不存在');
    }
    return image;
  }
}
