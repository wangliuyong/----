import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PrismaService } from '../../prisma/prisma.service';
import type { AiDataSource } from '../dto/sync.dto';
import { loadArticles } from '../loaders/article.loader';
import { loadMessages } from '../loaders/message.loader';
import { loadProjects } from '../loaders/project.loader';
import { loadSystemLogs } from '../loaders/system-log.loader';
import { AiVectorStoreService } from './ai-vector-store.service';

/** 单数据源同步结果 */
export interface SourceSyncResult {
  source: AiDataSource;
  chunkCount: number;
  error?: string;
}

/**
 * 文档摄取服务：从 Prisma 拉取各数据源 → 分块 → 向量化写入 LanceDB。
 */
@Injectable()
export class AiIngestService {
  private readonly chunkSize = Number(process.env.AI_CHUNK_SIZE ?? 800);
  private readonly chunkOverlap = Number(process.env.AI_CHUNK_OVERLAP ?? 100);

  constructor(
    private readonly prisma: PrismaService,
    private readonly vectorStore: AiVectorStoreService,
  ) {}

  /** 按选定数据源执行同步 */
  async syncSources(sources: AiDataSource[]): Promise<SourceSyncResult[]> {
    const results: SourceSyncResult[] = [];

    for (const source of sources) {
      try {
        const chunkCount = await this.syncOne(source);
        results.push({ source, chunkCount });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        results.push({ source, chunkCount: 0, error: message });
      }
    }

    return results;
  }

  /** 同步单个数据源 */
  private async syncOne(source: AiDataSource): Promise<number> {
    const documents = await this.loadDocuments(source);
    if (!documents.length) {
      await this.vectorStore.deleteBySource(source);
      return 0;
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });
    const splits = await splitter.splitDocuments(documents);

    await this.vectorStore.deleteBySource(source);

    const chunks = splits.map((doc) => ({
      text: doc.pageContent,
      source: String(doc.metadata.source ?? source),
      sourceId: String(doc.metadata.sourceId ?? ''),
      title: String(doc.metadata.title ?? ''),
      slug: String(doc.metadata.slug ?? ''),
    }));

    return this.vectorStore.addChunks(chunks);
  }

  /** 从数据库加载指定数据源的 Document 列表 */
  private async loadDocuments(source: AiDataSource) {
    switch (source) {
      case 'articles':
        return loadArticles(await this.prisma.article.findMany());
      case 'projects':
        return loadProjects(await this.prisma.project.findMany());
      case 'messages':
        return loadMessages(await this.prisma.message.findMany());
      case 'logs': {
        const [auditLogs, appLogs] = await Promise.all([
          this.prisma.adminAuditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 2000 }),
          this.prisma.appLog.findMany({ orderBy: { createdAt: 'desc' }, take: 2000 }),
        ]);
        return loadSystemLogs(auditLogs, appLogs);
      }
      default:
        return [];
    }
  }
}
