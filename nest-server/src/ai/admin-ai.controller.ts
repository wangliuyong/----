import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { PrismaService } from '../prisma/prisma.service';
import { DeleteKnowledgeChunksDto } from './dto/delete-knowledge-chunks.dto';
import { ListKnowledgeChunksDto } from './dto/list-knowledge-chunks.dto';
import { UpdateAiConfigDto } from './dto/update-ai-config.dto';
import { SyncDto } from './dto/sync.dto';
import { AiConfigService } from './services/ai-config.service';
import { AiEmbeddingsService } from './services/ai-embeddings.service';
import { AiIngestService } from './services/ai-ingest.service';
import { AiVectorStoreService } from './services/ai-vector-store.service';

/** 管理端 AI 小助手 API */
@Controller('api/admin/ai')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminAiController {
  constructor(
    private readonly ingestService: AiIngestService,
    private readonly vectorStore: AiVectorStoreService,
    private readonly prisma: PrismaService,
    private readonly aiConfig: AiConfigService,
    private readonly embeddings: AiEmbeddingsService,
  ) {}

  /** 读取 AI 配置（API Key 脱敏） */
  @Get('config')
  @RequirePermissions('admin:ai-assistant:view')
  getConfig() {
    return this.aiConfig.getPublicConfig();
  }

  /** 更新 AI 配置（OPENAI_API_KEY / OPENAI_BASE_URL） */
  @Put('config')
  @RequirePermissions('admin:ai-assistant:update')
  async updateConfig(@Body() dto: UpdateAiConfigDto) {
    const config = await this.aiConfig.updateConfig(dto);
    this.embeddings.resetCache();
    this.vectorStore.resetTable();
    return config;
  }

  /** 多选数据源一键同步向量化 */
  @Post('sync')
  @RequirePermissions('admin:ai-assistant:sync')
  async sync(@Body() dto: SyncDto) {
    const record = await this.prisma.aiSyncRecord.create({
      data: {
        sources: JSON.stringify(dto.sources),
        status: 'running',
      },
    });

    const results = await this.ingestService.syncSources(dto.sources);
    const chunkCount = results.reduce((sum, r) => sum + r.chunkCount, 0);
    const hasError = results.some((r) => r.error);
    const errorMsg = results
      .filter((r) => r.error)
      .map((r) => `${r.source}: ${r.error}`)
      .join('; ');

    await this.prisma.aiSyncRecord.update({
      where: { id: record.id },
      data: {
        status: hasError ? 'partial' : 'success',
        chunkCount,
        error: errorMsg || null,
        finishedAt: new Date(),
      },
    });

    return { recordId: record.id, results, chunkCount };
  }

  /** 最近同步记录 */
  @Get('sync/status')
  @RequirePermissions('admin:ai-assistant:view')
  async syncStatus() {
    const records = await this.prisma.aiSyncRecord.findMany({
      orderBy: { startedAt: 'desc' },
      take: 10,
    });
    return records.map((r) => ({
      ...r,
      sources: JSON.parse(r.sources) as string[],
    }));
  }

  /** 各数据源向量 chunk 统计 */
  @Get('stats')
  @RequirePermissions('admin:ai-assistant:view')
  async stats() {
    const vectorStats = await this.vectorStore.statsBySource();
    const configured = await this.aiConfig.isConfigured();
    return { vectorStats, configured };
  }

  /** 知识库向量块分页列表（LanceDB） */
  @Get('knowledge/chunks')
  @RequirePermissions('admin:ai-knowledge:view')
  listKnowledgeChunks(@Query() query: ListKnowledgeChunksDto) {
    return this.vectorStore.listChunks({
      page: query.page,
      pageSize: query.pageSize,
      source: query.source,
      keyword: query.keyword,
    });
  }

  /** 单条向量块详情 */
  @Get('knowledge/chunks/:id')
  @RequirePermissions('admin:ai-knowledge:view')
  async getKnowledgeChunk(@Param('id') id: string) {
    const chunk = await this.vectorStore.getChunkById(id);
    if (!chunk) {
      throw new NotFoundException('向量记录不存在');
    }
    return chunk;
  }

  /** 删除单条向量块 */
  @Delete('knowledge/chunks/:id')
  @RequirePermissions('admin:ai-knowledge:delete')
  async deleteKnowledgeChunk(@Param('id') id: string) {
    const deleted = await this.vectorStore.deleteByIds([id]);
    if (!deleted) {
      throw new NotFoundException('向量记录不存在或已删除');
    }
    return { deleted: 1 };
  }

  /** 批量删除向量块 */
  @Post('knowledge/chunks/batch-delete')
  @RequirePermissions('admin:ai-knowledge:delete')
  async batchDeleteKnowledgeChunks(@Body() dto: DeleteKnowledgeChunksDto) {
    const deleted = await this.vectorStore.deleteByIds(dto.ids);
    return { deleted };
  }
}
