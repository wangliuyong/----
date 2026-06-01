import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from '../article/dto/create-article.dto';
import { ArticleService } from '../article/article.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLinkDto, UpdateLinkDto } from '../link/dto/create-link.dto';
import { LinkService } from '../link/link.service';
import { MessageService } from '../message/message.service';
import { CreateProjectDto, UpdateProjectDto } from '../project/dto/create-project.dto';
import { ProjectService } from '../project/project.service';
import { SiteService } from '../site/site.service';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto';

/** 管理后台 API（需 JWT 鉴权） */
@Controller('api/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly siteService: SiteService,
    private readonly articleService: ArticleService,
    private readonly projectService: ProjectService,
    private readonly linkService: LinkService,
    private readonly messageService: MessageService,
  ) {}

  // ---------- 站点配置 ----------
  @Get('site')
  getSite() {
    return this.siteService.getPublicConfig();
  }

  @Put('site')
  updateSite(@Body() dto: UpdateSiteConfigDto) {
    return this.siteService.updateConfig(dto);
  }

  // ---------- 博客 ----------
  @Get('articles')
  listArticles() {
    return this.articleService.findAll({});
  }

  @Post('articles')
  createArticle(@Body() dto: CreateArticleDto) {
    return this.articleService.create(dto);
  }

  @Put('articles/:id')
  updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.articleService.update(id, dto);
  }

  @Delete('articles/:id')
  deleteArticle(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.remove(id);
  }

  // ---------- 项目 ----------
  @Get('projects')
  listProjects() {
    return this.projectService.findAll();
  }

  @Post('projects')
  createProject(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Put('projects/:id')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, dto);
  }

  @Delete('projects/:id')
  deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }

  // ---------- 友链 ----------
  @Get('links')
  listLinks() {
    return this.linkService.findAll();
  }

  @Post('links')
  createLink(@Body() dto: CreateLinkDto) {
    return this.linkService.create(dto);
  }

  @Put('links/:id')
  updateLink(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLinkDto) {
    return this.linkService.update(id, dto);
  }

  @Delete('links/:id')
  deleteLink(@Param('id', ParseIntPipe) id: number) {
    return this.linkService.remove(id);
  }

  // ---------- 留言 ----------
  @Get('messages')
  listMessages() {
    return this.messageService.findAll();
  }

  @Delete('messages/:id')
  deleteMessage(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.remove(id);
  }
}
