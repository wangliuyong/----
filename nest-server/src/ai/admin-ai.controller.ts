import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../rbac/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../rbac/guards/permissions.guard';
import { PrismaService } from '../prisma/prisma.service';
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
}
