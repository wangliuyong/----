import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMessageDto) {
    return this.prisma.message.create({ data: dto });
  }

  findAll() {
    return this.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async remove(id: number) {
    const item = await this.prisma.message.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('留言不存在');
    return this.prisma.message.delete({ where: { id } });
  }
}
