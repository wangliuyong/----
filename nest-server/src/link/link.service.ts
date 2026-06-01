import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LinkService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.link.findMany({ orderBy: { sort: 'asc' } });
  }
}
