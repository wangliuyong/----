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
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { SiteService } from '../site/site.service';
import { UpdateSiteConfigDto } from './dto/update-site-config.dto';

/** 管理后台 CMS API（需 JWT + 权限点） */
@Controller('api/admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminController {
  constructor(
    private readonly siteService: SiteService,
    private readonly articleService: ArticleService,
    private readonly projectService: ProjectService,
    private readonly linkService: LinkService,
    private readonly messageService: MessageService,
  ) {}

  @Get('site')
  @RequirePermissions('admin:site:view')
  getSite() {
    return this.siteService.getPublicConfig();
  }

  @Put('site')
  @RequirePermissions('admin:site:update', 'admin:nav:update', 'admin:about:update', 'admin:contact:update')
  updateSite(@Body() dto: UpdateSiteConfigDto) {
    return this.siteService.updateConfig(dto);
  }

  @Get('articles')
  @RequirePermissions('admin:articles:view')
  listArticles() {
    return this.articleService.findAll({});
  }

  @Get('articles/:id')
  @RequirePermissions('admin:articles:view')
  getArticle(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOne(id);
  }

  @Post('articles')
  @RequirePermissions('admin:articles:create')
  createArticle(@Body() dto: CreateArticleDto) {
    return this.articleService.create(dto);
  }

  @Put('articles/:id')
  @RequirePermissions('admin:articles:update')
  updateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.articleService.update(id, dto);
  }

  @Delete('articles/:id')
  @RequirePermissions('admin:articles:delete')
  deleteArticle(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.remove(id);
  }

  @Get('projects')
  @RequirePermissions('admin:projects:view')
  listProjects() {
    return this.projectService.findAll();
  }

  @Post('projects')
  @RequirePermissions('admin:projects:create')
  createProject(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Put('projects/:id')
  @RequirePermissions('admin:projects:update')
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectService.update(id, dto);
  }

  @Delete('projects/:id')
  @RequirePermissions('admin:projects:delete')
  deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }

  @Get('links')
  @RequirePermissions('admin:links:view')
  listLinks() {
    return this.linkService.findAll();
  }

  @Post('links')
  @RequirePermissions('admin:links:create')
  createLink(@Body() dto: CreateLinkDto) {
    return this.linkService.create(dto);
  }

  @Put('links/:id')
  @RequirePermissions('admin:links:update')
  updateLink(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLinkDto) {
    return this.linkService.update(id, dto);
  }

  @Delete('links/:id')
  @RequirePermissions('admin:links:delete')
  deleteLink(@Param('id', ParseIntPipe) id: number) {
    return this.linkService.remove(id);
  }

  @Get('messages')
  @RequirePermissions('admin:messages:view')
  listMessages() {
    return this.messageService.findAll();
  }

  @Delete('messages/:id')
  @RequirePermissions('admin:messages:delete')
  deleteMessage(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.remove(id);
  }
}
