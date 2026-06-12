import { Controller, Get } from '@nestjs/common';
import { ConvenienceApi } from '../common/convenience-api.decorator';
import { ConvPublic } from '../common/public.decorator';
import { ConvCategoryService } from './conv-category.service';

/** 便民分类接口 */
@ConvenienceApi()
@ConvPublic()
@Controller('api/categories')
export class ConvCategoryController {
  constructor(private readonly categoryService: ConvCategoryService) {}

  /** 分类树 */
  @Get('tree')
  tree() {
    return this.categoryService.findTree();
  }

  /** 一级分类 */
  @Get('root')
  root() {
    return this.categoryService.findRootList();
  }
}
