import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PrismaService } from '../../prisma/prisma.service';
import type { AiDataSource } from '../dto/sync.dto';
import type { SyncItemDto } from '../dto/sync.dto';
import { loadArticles } from '../loaders/article.loader';
import { loadMessages } from '../loaders/message.loader';
import { loadProjects } from '../loaders/project.loader';
import { loadSystemLogs } from '../loaders/system-log.loader';
import { AiVectorStoreService } from './ai-vector-store.service';

/** 单数据源同步结果 */
export interface SourceSyncResult {
  source: AiDataSource;
  /** 本次提交的记录 id 列表 */
  ids: string[];
  chunkCount: number;
  error?: string;
}

/**
 * 文档摄取服务：按管理端勾选的记录 id → 分块 → 向量化写入 LanceDB。
 * 仅更新选中记录的向量块，不默认全表同步。
 */
@Injectable()
export class AiIngestService {
  private readonly chunkSize = Number(process.env.AI_CHUNK_SIZE ?? 800);
  private readonly chunkOverlap = Number(process.env.AI_CHUNK_OVERLAP ?? 100);

  constructor(
    private readonly prisma: PrismaService,
    private readonly vectorStore: AiVectorStoreService,
  ) {}

  /** 按勾选的 items 执行增量同步 */
  async syncItems(items: SyncItemDto[]): Promise<SourceSyncResult[]> {
    const results: SourceSyncResult[] = [];

    for (const item of items) {
      const ids = [...new Set(item.ids.map((id) => id.trim()).filter(Boolean))];
      if (!ids.length) {
        results.push({
          source: item.source,
          ids: [],
          chunkCount: 0,
          error: '未选择任何记录',
        });
        continue;
      }

      try {
        const chunkCount = await this.syncOne(item.source, ids);
        results.push({ source: item.source, ids, chunkCount });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        results.push({ source: item.source, ids, chunkCount: 0, error: message });
      }
    }

    return results;
  }

  /**
   * 同步单数据源下指定记录：先删除这些 sourceId 的旧向量，再写入新分块。
   */
  private async syncOne(source: AiDataSource, ids: string[]): Promise<number> {
    const sourceIdsForStore = this.resolveVectorSourceIds(source, ids);
    await this.vectorStore.deleteBySourceAndSourceIds(source, sourceIdsForStore);

    const documents = await this.loadDocuments(source, ids);
    if (!documents.length) {
      return 0;
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });
    const splits = await splitter.splitDocuments(documents);

    const chunks = splits.map((doc) => ({
      text: doc.pageContent,
      source: String(doc.metadata.source ?? source),
      sourceId: String(doc.metadata.sourceId ?? ''),
      title: String(doc.metadata.title ?? ''),
      slug: String(doc.metadata.slug ?? ''),
    }));

    return this.vectorStore.addChunks(chunks);
  }

  /** 与 LanceDB metadata.sourceId 对齐的 id 列表 */
  private resolveVectorSourceIds(source: AiDataSource, ids: string[]): string[] {
    if (source === 'logs') {
      return ids.map((id) => {
        if (id.startsWith('audit:') || id.startsWith('app:')) return id;
        return id;
      });
    }
    return ids.map((id) => String(Number(id)));
  }

  /** 按 id 从数据库加载 Document */
  private async loadDocuments(source: AiDataSource, ids: string[]) {
    switch (source) {
      case 'articles': {
        const numericIds = this.parseNumericIds(ids);
        if (!numericIds.length) return [];
        return loadArticles(
          await this.prisma.article.findMany({ where: { id: { in: numericIds } } }),
        );
      }
      case 'projects': {
        const numericIds = this.parseNumericIds(ids);
        if (!numericIds.length) return [];
        return loadProjects(
          await this.prisma.project.findMany({ where: { id: { in: numericIds } } }),
        );
      }
      case 'messages': {
        const numericIds = this.parseNumericIds(ids);
        if (!numericIds.length) return [];
        return loadMessages(
          await this.prisma.message.findMany({ where: { id: { in: numericIds } } }),
        );
      }
      case 'logs': {
        const auditIds = ids
          .filter((id) => id.startsWith('audit:'))
          .map((id) => Number(id.slice('audit:'.length)))
          .filter((n) => !Number.isNaN(n));
        const appIds = ids
          .filter((id) => id.startsWith('app:'))
          .map((id) => Number(id.slice('app:'.length)))
          .filter((n) => !Number.isNaN(n));

        const [auditLogs, appLogs] = await Promise.all([
          auditIds.length
            ? this.prisma.adminAuditLog.findMany({ where: { id: { in: auditIds } } })
            : [],
          appIds.length
            ? this.prisma.appLog.findMany({ where: { id: { in: appIds } } })
            : [],
        ]);
        return loadSystemLogs(auditLogs, appLogs);
      }
      default:
        return [];
    }
  }

  private parseNumericIds(ids: string[]): number[] {
    return [...new Set(ids.map((id) => Number(id)).filter((n) => !Number.isNaN(n) && n > 0))];
  }
}
