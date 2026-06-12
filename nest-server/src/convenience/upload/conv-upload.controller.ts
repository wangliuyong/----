import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { CurrentConvUser } from '../common/current-user.decorator';
import { ConvPublic } from '../common/public.decorator';
import { ConvJwtAuthGuard } from '../auth/conv-jwt-auth.guard';
import { ConvUploadService } from './conv-upload.service';

/** 图片上传与读取（数据库存储，不写本地磁盘） */
@Controller('api/upload')
export class ConvUploadController {
  constructor(private readonly uploadService: ConvUploadService) {}

  /** 上传图片：内存接收 → 入库 → 返回访问路径 */
  @ConvenienceApi()
  @UseGuards(ConvJwtAuthGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new Error('仅支持图片文件'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentConvUser() user: { userId: number },
  ) {
    if (!file?.buffer?.length) {
      return { url: '' };
    }

    const record = await this.uploadService.saveImage(
      user.userId,
      file.buffer,
      file.mimetype,
    );

    /** 相对路径入库，客户端展示时再 resolveMediaUrl */
    return { url: `/api/upload/image/${record.id}` };
  }

  /** 读取图片（公开，供 img 标签加载） */
  @ConvPublic()
  @Get('image/:id')
  async getImage(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const image = await this.uploadService.findImage(id);
    res.set('Content-Type', image.mimeType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(Buffer.from(image.data));
  }
}
