import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('api/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('list')
  list(
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.articleService.findAll({ category, tag, year, month });
  }

  @Get('slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.articleService.findBySlug(slug);
  }

  @Get(':id')
  detail(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }
}
